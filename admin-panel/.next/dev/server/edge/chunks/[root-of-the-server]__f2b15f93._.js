(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/[root-of-the-server]__f2b15f93._.js",
"[externals]/node:buffer [external] (node:buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[project]/middleware.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "config",
    ()=>config,
    "middleware",
    ()=>middleware
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$panel$2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/admin-panel/node_modules/next/dist/esm/api/server.js [middleware-edge] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$panel$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin-panel/node_modules/next/dist/esm/server/web/exports/index.js [middleware-edge] (ecmascript)");
;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
// List of public routes that don't require authentication
const publicRoutes = [
    '/',
    '/landing',
    '/login',
    '/signup',
    '/create-account',
    '/account/type-selection',
    '/support',
    '/admin/login',
    '/api/auth/callback'
];
// Routes by role
const roleRoutes = {
    super_admin: [
        '/dashboard/super-admin',
        '/admin',
        '/admin/dashboard'
    ],
    admin: [
        '/dashboard/admin',
        '/admin',
        '/admin/dashboard',
        '/admin/users',
        '/admin/calls',
        '/admin/top-up',
        '/admin/send-money',
        '/admin/recharge',
        '/admin/user-activity',
        '/admin/plans',
        '/admin/billing',
        '/admin/settings'
    ],
    support: [
        '/dashboard/support'
    ],
    user: [
        '/dashboard/user',
        '/profile'
    ]
};
async function middleware(request) {
    const { pathname } = request.nextUrl;
    // Allow public routes
    if (publicRoutes.some((route)=>pathname.startsWith(route))) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$panel$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
    }
    // Get auth token from cookie
    const token = request.cookies.get('auth_session')?.value;
    if (!token) {
        // Not authenticated - redirect to login
        return __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$panel$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL('/login', request.url));
    }
    // For dashboard routes, verify user role and redirect if necessary
    if (pathname.startsWith('/dashboard')) {
        try {
            // We can't fully verify role in middleware without making DB calls
            // This is handled by the client-side route guards and server components
            // Just allow the request to proceed, the page will handle auth
            return __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$panel$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
        } catch (error) {
            console.error('Middleware auth error:', error);
            return __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$panel$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL('/login', request.url));
        }
    }
    // Protected routes
    if (pathname.startsWith('/profile') || pathname.startsWith('/settings')) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$panel$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$admin$2d$panel$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
}
const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico).*)'
    ]
};
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__f2b15f93._.js.map