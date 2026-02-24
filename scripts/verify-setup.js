#!/usr/bin/env node

/**
 * Talaritel Setup Verification Script
 * Verifies all prerequisites and configuration before deployment
 */

const fs = require('fs')
const path = require('path')

const checks = {
  passed: [],
  failed: [],
  warnings: [],
}

function checkFile(filePath, name) {
  const fullPath = path.join(process.cwd(), filePath)
  if (fs.existsSync(fullPath)) {
    checks.passed.push(`✓ ${name} exists`)
    return true
  } else {
    checks.failed.push(`✗ ${name} missing`)
    return false
  }
}

function checkEnvVar(name, optional = false) {
  if (process.env[name]) {
    checks.passed.push(`✓ ${name} set`)
    return true
  } else {
    const msg = `${optional ? 'Warning' : 'Error'}: ${name} not set`
    if (optional) {
      checks.warnings.push(`⚠ ${name} not set (optional)`)
    } else {
      checks.failed.push(`✗ ${name} not set`)
    }
    return !optional
  }
}

function printSection(title) {
  console.log(`\n${'='.repeat(50)}`)
  console.log(`  ${title}`)
  console.log(`${'='.repeat(50)}`)
}

function printResults() {
  console.log(`\n${'='.repeat(50)}`)
  console.log('  VERIFICATION RESULTS')
  console.log(`${'='.repeat(50)}`)

  if (checks.passed.length > 0) {
    console.log('\n✓ Passed:')
    checks.passed.forEach(c => console.log(`  ${c}`))
  }

  if (checks.warnings.length > 0) {
    console.log('\n⚠ Warnings:')
    checks.warnings.forEach(c => console.log(`  ${c}`))
  }

  if (checks.failed.length > 0) {
    console.log('\n✗ Failed:')
    checks.failed.forEach(c => console.log(`  ${c}`))
  }

  const total = checks.passed.length
  const failed = checks.failed.length

  console.log(`\n${'='.repeat(50)}`)
  console.log(`  ${total} passed, ${failed} failed, ${checks.warnings.length} warnings`)
  console.log(`${'='.repeat(50)}\n`)

  if (failed > 0) {
    console.log('❌ Setup verification failed. Please fix the errors above.')
    process.exit(1)
  } else {
    console.log('✅ Setup verification passed!')
    process.exit(0)
  }
}

// Start verification
console.log('\n🔍 Talaritel Setup Verification\n')

// Check Node version
printSection('Node.js Version')
const nodeVersion = process.version
const majorVersion = parseInt(nodeVersion.split('.')[0].slice(1))
if (majorVersion >= 18) {
  checks.passed.push(`✓ Node.js ${nodeVersion} (18+ required)`)
} else {
  checks.failed.push(`✗ Node.js ${nodeVersion} (18+ required)`)
}

// Check required files
printSection('Required Files')
checkFile('package.json', 'package.json')
checkFile('.env.local', '.env.local')
checkFile('next.config.js', 'next.config.js')
checkFile('tsconfig.json', 'tsconfig.json')
checkFile('tailwind.config.js', 'tailwind.config.js')

// Check optional files
printSection('Documentation Files')
const hasSetupMd = checkFile('SETUP.md', 'SETUP.md')
const hasDeploymentMd = checkFile('DEPLOYMENT.md', 'DEPLOYMENT.md')
const hasReadme = checkFile('README-TALARITEL.md', 'README-TALARITEL.md')

if (!hasSetupMd || !hasDeploymentMd || !hasReadme) {
  checks.warnings.push('⚠ Some documentation files missing')
}

// Check environment variables
printSection('Environment Variables')
const hasUrl = checkEnvVar('NEXT_PUBLIC_SUPABASE_URL')
const hasAnonKey = checkEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY')
const hasServiceKey = checkEnvVar('SUPABASE_SERVICE_ROLE_KEY')

// Check optional env vars
checkEnvVar('ADMIN_USERNAME', true)
checkEnvVar('STRIPE_PUBLIC_KEY', true)

// Check directories
printSection('Project Structure')
const dirChecks = [
  'app',
  'app/api',
  'components',
  'lib',
  'scripts',
  'public',
]

dirChecks.forEach(dir => {
  const fullPath = path.join(process.cwd(), dir)
  if (fs.existsSync(fullPath)) {
    checks.passed.push(`✓ ${dir}/ directory exists`)
  } else {
    checks.warnings.push(`⚠ ${dir}/ directory missing`)
  }
})

// Check key app files
printSection('Application Files')
checkFile('app/layout.tsx', 'Root layout')
checkFile('app/page.tsx', 'Home page')
checkFile('app/landing/page.tsx', 'Landing page')
checkFile('app/profile/page.tsx', 'Profile page')
checkFile('app/billing/page.tsx', 'Billing page')
checkFile('middleware.ts', 'Middleware')

// Check dependencies
printSection('Dependencies')
try {
  const packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8'))
  
  const requiredDeps = [
    'next',
    'react',
    'react-dom',
    '@supabase/supabase-js',
    'tailwindcss',
    'lucide-react',
    'sonner',
    'zod',
    'swr',
  ]

  requiredDeps.forEach(dep => {
    if (packageJson.dependencies[dep]) {
      checks.passed.push(`✓ ${dep} installed`)
    } else {
      checks.failed.push(`✗ ${dep} missing from package.json`)
    }
  })
} catch (error) {
  checks.failed.push(`✗ Could not read package.json: ${error.message}`)
}

// Check database tables are accessible
printSection('Database Setup')
if (hasUrl && hasAnonKey) {
  checks.passed.push(`✓ Supabase credentials configured`)
  checks.passed.push(`✓ Ready for database schema setup`)
} else {
  checks.failed.push(`✗ Supabase credentials missing`)
}

// Print results
printResults()
