"use client";

import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/components/ui/accordion";
import { Badge } from "@/shared/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Progress } from "@/shared/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Separator } from "@/shared/components/ui/separator";

type Difficulty = "Cơ bản" | "Trung cấp" | "Nâng cao";

interface Question {
  q: string;
  a: string;
}

interface Topic {
  id: number;
  title: string;
  icon: string;
  difficulty: Difficulty;
  progress: number;
  description: string;
  questions: Question[];
}

const TOPICS: Topic[] = [
  {
    id: 1,
    title: "HTML & CSS",
    icon: "🎨",
    difficulty: "Cơ bản",
    progress: 90,
    description: "Nền tảng xây dựng giao diện web — box model, layout, specificity.",
    questions: [
      {
        q: "Box model trong CSS gồm những gì?",
        a: "Box model gồm 4 lớp từ trong ra ngoài: content → padding → border → margin. Thuộc tính box-sizing: border-box khiến width/height tính cả padding và border, giúp layout dễ tính toán hơn.",
      },
      {
        q: "Flexbox và CSS Grid khác nhau thế nào?",
        a: "Flexbox là layout 1 chiều (hàng hoặc cột), phù hợp cho alignment trong component. Grid là layout 2 chiều (hàng và cột đồng thời), phù hợp cho page-level layout. Thực tế dùng cả hai kết hợp.",
      },
      {
        q: "CSS Specificity được tính như thế nào?",
        a: "Specificity tính theo thang (a, b, c, d): inline style (1,0,0,0) > ID (0,1,0,0) > class/pseudo-class/attribute (0,0,1,0) > element/pseudo-element (0,0,0,1). !important override tất cả nhưng nên tránh dùng.",
      },
      {
        q: "BEM naming convention là gì?",
        a: "BEM = Block__Element--Modifier. Ví dụ: .card (block), .card__title (element), .card--featured (modifier). Giúp CSS có cấu trúc, tránh collision, dễ đọc trong dự án lớn.",
      },
    ],
  },
  {
    id: 2,
    title: "JavaScript Core",
    icon: "⚡",
    difficulty: "Cơ bản",
    progress: 85,
    description: "Closure, prototype, event loop, scope — những khái niệm cốt lõi của JS.",
    questions: [
      {
        q: "Closure là gì? Cho ví dụ thực tế.",
        a: "Closure là hàm có khả năng nhớ và truy cập scope nơi nó được tạo ra dù hàm đó đã thực thi xong. Ứng dụng: debounce, memoize, factory function, module pattern để private state.",
      },
      {
        q: "Event Loop hoạt động ra sao?",
        a: "JS single-threaded. Event Loop liên tục kiểm tra: nếu Call Stack rỗng thì lấy task từ queue vào. Microtask queue (Promise.then, queueMicrotask) ưu tiên hơn Macrotask queue (setTimeout, setInterval). Microtask chạy hết trước khi render.",
      },
      {
        q: "var, let, const khác nhau thế nào?",
        a: "var: function-scoped, hoisted (initialized as undefined), có thể redeclare. let: block-scoped, hoisted nhưng không initialized (TDZ), không redeclare. const: block-scoped, phải assign ngay, không reassign (nhưng object/array vẫn mutable).",
      },
      {
        q: "Prototype chain là gì?",
        a: "Mọi object JS đều có [[Prototype]] trỏ tới object cha. Khi truy cập property, JS tìm từ object hiện tại → prototype chain → Object.prototype → null. class trong ES6 là syntactic sugar trên prototype.",
      },
    ],
  },
  {
    id: 3,
    title: "Async JavaScript",
    icon: "🔄",
    difficulty: "Trung cấp",
    progress: 75,
    description: "Promise, async/await, error handling, concurrent operations.",
    questions: [
      {
        q: "Promise.all vs Promise.allSettled vs Promise.race?",
        a: "Promise.all: chạy song song, reject ngay nếu 1 cái fail. Promise.allSettled: chờ tất cả xong bất kể success/fail, trả về array trạng thái. Promise.race: resolve/reject theo cái nhanh nhất. Promise.any: resolve theo cái thành công đầu tiên.",
      },
      {
        q: "Làm sao handle error trong async/await?",
        a: "Dùng try/catch để bắt lỗi. Có thể viết helper: const [err, data] = await to(promise) theo Result pattern. Tránh bỏ sót await khiến lỗi unhandled. Luôn thêm .catch() hoặc catch block cho top-level async code.",
      },
      {
        q: "Debounce và throttle khác nhau thế nào?",
        a: "Debounce: chỉ thực thi sau khi event dừng được N ms. Dùng cho search input, form validation. Throttle: đảm bảo chỉ thực thi tối đa 1 lần trong N ms dù event liên tục. Dùng cho scroll, resize handler.",
      },
    ],
  },
  {
    id: 4,
    title: "TypeScript",
    icon: "🔷",
    difficulty: "Trung cấp",
    progress: 80,
    description: "Type system, generics, utility types — viết code an toàn và scale được.",
    questions: [
      {
        q: "Type vs Interface — khi nào dùng cái nào?",
        a: "Interface: dùng khi định nghĩa shape của object/class, hỗ trợ declaration merging, extends rõ ràng hơn. Type: dùng khi cần union, intersection, mapped types, template literal types. Thực tế: dùng interface cho public API của package, type cho internal logic.",
      },
      {
        q: "Generics là gì? Ví dụ thực tế.",
        a: "Generics cho phép viết code reusable với nhiều type khác nhau. Ví dụ: function identity<T>(arg: T): T — hàm này làm việc với bất kỳ type nào mà vẫn giữ type safety. Dùng nhiều trong: API response wrapper, hook, utility function.",
      },
      {
        q: "Utility types hay dùng nhất?",
        a: "Partial<T>: tất cả fields optional. Required<T>: tất cả fields required. Pick<T, K>: chọn một số fields. Omit<T, K>: bỏ một số fields. Readonly<T>: immutable. Record<K, V>: tạo object type. ReturnType<T>: lấy return type của function.",
      },
      {
        q: "unknown vs any khác nhau thế nào?",
        a: "any: tắt hoàn toàn type checking — không nên dùng. unknown: type-safe alternative, phải narrow type trước khi dùng (if typeof x === 'string'). Luôn ưu tiên unknown khi nhận dữ liệu từ bên ngoài (API, user input).",
      },
    ],
  },
  {
    id: 5,
    title: "React Cốt Lõi",
    icon: "⚛️",
    difficulty: "Trung cấp",
    progress: 88,
    description: "Virtual DOM, hooks, re-render, component design patterns.",
    questions: [
      {
        q: "Virtual DOM hoạt động ra sao?",
        a: "React duy trì Virtual DOM (cây JS object). Khi state thay đổi, React tạo Virtual DOM mới, so sánh với cái cũ (reconciliation/diffing), chỉ update phần thực sự thay đổi trên Real DOM. React Fiber (v16+) chia reconciliation thành chunks, cho phép interrupt để ưu tiên update quan trọng hơn.",
      },
      {
        q: "Khi nào component React re-render?",
        a: "Component re-render khi: (1) state thay đổi, (2) props thay đổi, (3) context thay đổi, (4) parent re-render (dù props không đổi nếu không dùng memo). React.memo, useMemo, useCallback giúp tránh re-render không cần thiết.",
      },
      {
        q: "useCallback vs useMemo khác nhau thế nào?",
        a: "useMemo: cache kết quả của expensive calculation. useCallback: cache function reference — thường dùng khi pass callback xuống child component được wrap bởi React.memo. Cả hai đều có dependency array, chỉ recalculate khi deps thay đổi.",
      },
      {
        q: "useEffect cleanup function dùng khi nào?",
        a: "Cleanup chạy trước khi effect chạy lại hoặc component unmount. Dùng để: clear setTimeout/setInterval, unsubscribe event listener, cancel fetch request (AbortController), close WebSocket. Thiếu cleanup → memory leak và stale closure bug.",
      },
    ],
  },
  {
    id: 6,
    title: "State Management",
    icon: "🗄️",
    difficulty: "Trung cấp",
    progress: 70,
    description: "Context API, Zustand, Redux — chọn đúng tool cho đúng bài toán.",
    questions: [
      {
        q: "Khi nào dùng global state?",
        a: "Dùng global state khi: data cần chia sẻ giữa nhiều component không liên quan trong cây, data persist qua navigation, auth state, theme, shopping cart. Không lạm dụng — server state dùng React Query/SWR tốt hơn Zustand/Redux.",
      },
      {
        q: "Context API vs Zustand vs Redux — chọn gì?",
        a: "Context API: phù hợp cho low-frequency updates (theme, locale, user), không phù hợp cho high-frequency (list data). Zustand: nhẹ, ít boilerplate, tốt cho medium app. Redux Toolkit: tốt cho large app phức tạp, cần time-travel debug, middleware mạnh.",
      },
      {
        q: "Server State vs Client State khác nhau thế nào?",
        a: "Server state: data từ server (async, có thể stale, cần sync) — dùng React Query/SWR/RTK Query. Client state: UI state thuần túy (modal open, form values, selected tab) — dùng useState/Zustand. Đây là phân biệt quan trọng nhất trong architecture hiện đại.",
      },
    ],
  },
  {
    id: 7,
    title: "Performance",
    icon: "🚀",
    difficulty: "Nâng cao",
    progress: 65,
    description: "Core Web Vitals, code splitting, lazy loading, rendering patterns.",
    questions: [
      {
        q: "Core Web Vitals gồm những gì?",
        a: "LCP (Largest Contentful Paint): thời gian render element lớn nhất — target < 2.5s. INP (Interaction to Next Paint): độ trễ khi user interact — target < 200ms. CLS (Cumulative Layout Shift): layout shift không mong muốn — target < 0.1. Đây là metrics Google dùng để rank SEO.",
      },
      {
        q: "Code splitting và lazy loading hoạt động thế nào?",
        a: "Code splitting: chia bundle thành nhiều chunk nhỏ, chỉ load khi cần. React.lazy() + Suspense cho component-level splitting. Dynamic import() cho module-level. Route-based splitting là common pattern nhất. Giảm initial bundle size, cải thiện LCP.",
      },
      {
        q: "SSR, SSG, ISR, CSR — khác nhau thế nào?",
        a: "CSR: render hoàn toàn trên browser, SEO kém. SSR: render trên server mỗi request, SEO tốt, TTFB cao. SSG: render lúc build time, nhanh nhất, không real-time. ISR (Next.js): SSG + revalidate sau N giây — best of both worlds. Chọn theo nhu cầu data và SEO requirement.",
      },
    ],
  },
  {
    id: 8,
    title: "Testing",
    icon: "🧪",
    difficulty: "Trung cấp",
    progress: 72,
    description: "Unit, integration, E2E — testing strategy và best practices.",
    questions: [
      {
        q: "Testing pyramid là gì?",
        a: "Unit tests (nhiều nhất): test function/component riêng lẻ, nhanh, cheap. Integration tests (vừa): test nhiều unit phối hợp, vừa nhanh vừa realistic. E2E tests (ít nhất): test toàn bộ flow từ UI, chậm, expensive. Rule of thumb: 70% unit, 20% integration, 10% E2E.",
      },
      {
        q: "Testing Library — triết lý là gì?",
        a: "\"Test the way users use your app\" — test theo hành vi, không test implementation detail. Dùng getByRole, getByText, getByLabelText thay vì querySelector hay test state trực tiếp. Component có thể refactor hoàn toàn bên trong mà test vẫn pass nếu behavior không đổi.",
      },
      {
        q: "Mock, Stub, Spy khác nhau thế nào?",
        a: "Stub: replace function với implementation giả, trả về giá trị cố định. Mock: giống stub nhưng có thể assert được gọi bao nhiêu lần, với args gì. Spy: wrap function thật, theo dõi calls mà không thay đổi behavior. Trong Vitest/Jest: vi.fn() là mock, vi.spyOn() là spy.",
      },
    ],
  },
  {
    id: 9,
    title: "Web APIs & Security",
    icon: "🔒",
    difficulty: "Nâng cao",
    progress: 60,
    description: "CORS, XSS, CSRF, storage, WebSocket — bảo mật và Web Platform APIs.",
    questions: [
      {
        q: "CORS là gì và cách hoạt động?",
        a: "CORS (Cross-Origin Resource Sharing): browser block request đến origin khác theo Same-Origin Policy. Server opt-in bằng cách set headers Access-Control-Allow-Origin. Preflight request (OPTIONS) được gửi trước với 'non-simple' requests. CORS chỉ là browser policy — không phải security mechanism server-side.",
      },
      {
        q: "XSS và CSRF là gì? Cách phòng chống?",
        a: "XSS: inject script độc vào trang. Phòng: sanitize input/output, Content-Security-Policy header, avoid innerHTML. CSRF: trick user gửi request không mong muốn đến site đã authed. Phòng: CSRF token, SameSite cookie (Strict/Lax), Double Submit Cookie pattern.",
      },
      {
        q: "Cookie vs localStorage vs sessionStorage?",
        a: "Cookie: gửi tự động với mỗi request, httpOnly ngăn JS đọc (bảo mật hơn cho auth token), có expiry, max 4KB. localStorage: persist kể cả đóng tab, JS readable, 5-10MB, không tự gửi. sessionStorage: mất khi đóng tab. Auth token nên dùng httpOnly cookie, không dùng localStorage.",
      },
    ],
  },
  {
    id: 10,
    title: "Architecture & System Design",
    icon: "🏗️",
    difficulty: "Nâng cao",
    progress: 55,
    description: "Micro-frontend, monorepo, design system, FSD — architect for scale.",
    questions: [
      {
        q: "Micro-frontend là gì? Ưu nhược điểm?",
        a: "Chia frontend thành nhiều app nhỏ độc lập, mỗi team own một phần. Ưu: deploy độc lập, tech stack linh hoạt, team autonomy. Nhược: bundle size tăng (duplicate dependencies), UX consistency khó giữ, complexity tăng. Phù hợp cho large org với nhiều team, không phù hợp cho small team.",
      },
      {
        q: "Monorepo vs Multi-repo — khi nào chọn gì?",
        a: "Monorepo: share code dễ, atomic commits, single CI pipeline, developer experience tốt hơn. Cần tooling tốt (Turborepo, Nx). Multi-repo: team hoàn toàn độc lập, CI/CD đơn giản hơn mỗi repo, phù hợp khi các app ít share code. Xu hướng hiện tại: monorepo với Turborepo.",
      },
      {
        q: "Feature-Sliced Design (FSD) là gì?",
        a: "FSD là architecture methodology cho frontend: chia code theo layers (app → pages → widgets → features → entities → shared) và slices (theo domain). Mỗi layer chỉ import từ layer dưới. Giải quyết vấn đề spaghetti imports trong large codebase. Kết hợp tốt với Hexagonal Architecture.",
      },
      {
        q: "Khi nào nên build Design System riêng?",
        a: "Nên build khi: nhiều app cần UI nhất quán, team lớn (5+ developers), có designer dedicated. Không nên khi: 1 app duy nhất, team nhỏ (overhead không xứng). Bắt đầu với component library (shadcn, Radix) + design tokens trước khi build custom từ đầu.",
      },
    ],
  },
  {
    id: 11,
    title: "Next.js & SSR",
    icon: "▲",
    difficulty: "Trung cấp",
    progress: 78,
    description: "App Router, Server Components, data fetching, caching — Next.js hiện đại.",
    questions: [
      {
        q: "Server Components vs Client Components — khác nhau thế nào?",
        a: "Server Components (mặc định trong App Router): render trên server, không có state/event handlers, không tăng bundle size client, có thể async trực tiếp, truy cập database/filesystem. Client Components ('use client'): chạy trên browser, có state, hooks, event handlers. Nguyên tắc: push 'use client' boundary xuống thấp nhất có thể.",
      },
      {
        q: "Data fetching trong App Router hoạt động ra sao?",
        a: "Server Component có thể fetch trực tiếp bằng async/await. Next.js extend fetch API với caching: cache: 'force-cache' (SSG), cache: 'no-store' (SSR), next: { revalidate: N } (ISR). Parallel fetching với Promise.all(). Không cần useEffect hay React Query cho server-side data.",
      },
      {
        q: "Streaming và Suspense trong Next.js là gì?",
        a: "Streaming cho phép gửi HTML từng phần xuống client thay vì chờ toàn bộ. Dùng <Suspense fallback={<Loading/>}> để wrap component chậm — phần còn lại của page render trước, component chậm stream sau. Cải thiện TTFB và perceived performance đáng kể.",
      },
      {
        q: "Route Handlers vs Server Actions khác nhau thế nào?",
        a: "Route Handlers (app/api/): API endpoint truyền thống, nhận Request, trả Response, dùng cho external API, webhooks. Server Actions: function async chạy trên server, gọi trực tiếp từ form action hoặc event handler, không cần tạo API endpoint. Server Actions phù hợp cho mutations trong cùng app.",
      },
    ],
  },
  {
    id: 12,
    title: "CSS Nâng Cao",
    icon: "✨",
    difficulty: "Trung cấp",
    progress: 68,
    description: "Animations, custom properties, container queries, modern CSS features.",
    questions: [
      {
        q: "CSS Custom Properties (variables) mạnh hơn preprocessor variables ở điểm nào?",
        a: "CSS Custom Properties tồn tại ở runtime (không phải compile time), có thể thay đổi bằng JS, có thể override theo scope/media query, tham gia cascade và inheritance. Preprocessor variables (Sass $var) chỉ là compile-time text substitution. Custom properties là nền tảng của dynamic theming.",
      },
      {
        q: "CSS Animation vs CSS Transition khác nhau thế nào?",
        a: "Transition: chuyển đổi đơn giản giữa 2 state khi có trigger (hover, class change). Animation: keyframe-based, có thể loop, delay, chạy tự động không cần trigger, nhiều step hơn. Performance: ưu tiên transform và opacity vì chúng không trigger layout hay paint, chỉ composite.",
      },
      {
        q: "Container Queries là gì? Tại sao quan trọng?",
        a: "Container Queries cho phép style component dựa trên kích thước container cha, không phải viewport. Giải quyết vấn đề component-based responsive: cùng một component có thể layout khác nhau tùy context nó được đặt vào. Dùng @container thay vì @media cho component library.",
      },
    ],
  },
  {
    id: 13,
    title: "Accessibility (a11y)",
    icon: "♿",
    difficulty: "Trung cấp",
    progress: 58,
    description: "WCAG, ARIA, keyboard navigation — build web cho mọi người.",
    questions: [
      {
        q: "ARIA là gì và khi nào cần dùng?",
        a: "ARIA (Accessible Rich Internet Applications): set attributes giúp screen reader hiểu UI động. Nguyên tắc: chỉ dùng ARIA khi HTML semantic không đủ. Ưu tiên: native HTML element > ARIA. Ví dụ: <button> tốt hơn <div role='button'>. Sai ARIA còn tệ hơn không có ARIA.",
      },
      {
        q: "Keyboard navigation cần đảm bảo những gì?",
        a: "Tab order phải hợp lý (theo visual flow). Focus indicator phải visible (không remove outline mà không replace). Escape đóng modal/dropdown. Enter/Space activate button. Arrow keys điều hướng trong menu/listbox. Skip link để nhảy qua navigation. Tất cả interactive element phải reachable bằng keyboard.",
      },
      {
        q: "Contrast ratio và WCAG levels là gì?",
        a: "WCAG AA (tiêu chuẩn tối thiểu): contrast ratio 4.5:1 cho normal text, 3:1 cho large text. WCAG AAA: 7:1 cho normal text. Dùng tool như Colour Contrast Analyser hoặc browser DevTools để check. Color không được là cách duy nhất truyền thông tin (cần icon, text bổ sung).",
      },
    ],
  },
  {
    id: 14,
    title: "Build Tools",
    icon: "🔧",
    difficulty: "Trung cấp",
    progress: 72,
    description: "Vite, Webpack, esbuild, Turbopack — hiểu bundler để debug và optimize.",
    questions: [
      {
        q: "Vite nhanh hơn Webpack ở điểm nào?",
        a: "Dev server: Vite dùng native ES modules trên browser, không bundle khi dev — chỉ transform file khi được request. Webpack bundle toàn bộ trước. HMR: Vite cực nhanh vì chỉ invalidate module thay đổi. Build production: Vite dùng Rollup (đang migrate sang Rolldown/Rust). Webpack mature hơn, ecosystem rộng hơn.",
      },
      {
        q: "Tree shaking là gì và cần điều kiện gì để hoạt động?",
        a: "Tree shaking: loại bỏ code không được import (dead code elimination). Yêu cầu: (1) ES Modules (import/export, không phải require), (2) module phải side-effect free (package.json sideEffects: false), (3) bundler hỗ trợ (Webpack, Rollup, esbuild đều support). CommonJS modules không tree-shakeable.",
      },
      {
        q: "Source maps là gì? Production có nên bật không?",
        a: "Source maps map code đã minify/bundle về source code gốc, giúp debug. Development: luôn bật. Production: tùy chọn — hidden source maps (upload lên Sentry, không expose ra browser) là best practice. Expose source maps ra public giúp debug nhưng cũng để lộ business logic.",
      },
    ],
  },
  {
    id: 15,
    title: "Git & Workflow",
    icon: "🌿",
    difficulty: "Cơ bản",
    progress: 82,
    description: "Branching strategy, rebase vs merge, conventional commits, PR workflow.",
    questions: [
      {
        q: "Rebase vs Merge — khi nào dùng cái nào?",
        a: "Merge: preserve full history, tạo merge commit, an toàn cho shared branch. Rebase: rewrite history, linear history sạch hơn, không dùng trên public branch (rewrite history của người khác). Git flow thực tế: feature branch rebase onto main trước khi merge (squash/rebase merge) để giữ main history clean.",
      },
      {
        q: "Conventional Commits là gì?",
        a: "Format chuẩn cho commit message: type(scope): description. Types: feat (new feature), fix (bug fix), docs, style, refactor, test, chore, perf. Breaking change thêm ! hoặc BREAKING CHANGE trong footer. Lợi ích: auto-generate CHANGELOG, semantic versioning tự động, dễ đọc git log.",
      },
      {
        q: "Git hooks và CI/CD dùng để làm gì trong FE?",
        a: "Pre-commit hooks (Husky + lint-staged): chạy linter/formatter chỉ trên staged files trước khi commit. Commit-msg hook: validate commit message format. CI pipeline: run type-check, tests, build trên mỗi PR. CD: auto-deploy preview environments (Vercel, Netlify) cho mỗi PR — cho phép review visual trước khi merge.",
      },
    ],
  },
  {
    id: 16,
    title: "API & Data Fetching",
    icon: "🌐",
    difficulty: "Trung cấp",
    progress: 76,
    description: "REST, GraphQL, React Query, caching strategies, optimistic updates.",
    questions: [
      {
        q: "REST vs GraphQL — chọn gì cho FE?",
        a: "REST: đơn giản, cacheable bởi HTTP, over-fetching/under-fetching là vấn đề. GraphQL: client chỉ lấy đúng data cần, một endpoint, strongly typed schema, nhưng caching phức tạp hơn, learning curve cao. GraphQL tỏa sáng khi nhiều client (web/mobile) cần data shape khác nhau từ cùng backend.",
      },
      {
        q: "React Query giải quyết vấn đề gì?",
        a: "Server state management: caching, background refetch, stale-while-revalidate, pagination, infinite scroll, optimistic updates, request deduplication. Tránh viết boilerplate loading/error state, tránh duplicate fetch. Phân biệt rõ server state (React Query) và client state (Zustand/useState).",
      },
      {
        q: "Optimistic updates là gì?",
        a: "Cập nhật UI ngay lập tức trước khi server confirm, rollback nếu request fail. Cải thiện perceived performance đáng kể. Ví dụ: like button đổi state ngay khi click. React Query hỗ trợ qua onMutate callback. Cần xử lý edge case: concurrent mutations, rollback error.",
      },
    ],
  },
  {
    id: 17,
    title: "Browser Internals",
    icon: "🖥️",
    difficulty: "Nâng cao",
    progress: 52,
    description: "Rendering pipeline, reflow/repaint, compositor, memory management.",
    questions: [
      {
        q: "Browser rendering pipeline hoạt động ra sao?",
        a: "Parse HTML → DOM. Parse CSS → CSSOM. DOM + CSSOM → Render Tree. Layout (reflow): tính toán size/position. Paint: vẽ pixels. Composite: gộp layers. JavaScript chạy trên Main Thread, có thể block rendering. requestAnimationFrame để sync với render cycle.",
      },
      {
        q: "Reflow vs Repaint là gì? Tại sao cần tránh?",
        a: "Reflow (layout): tính toán lại geometry — đắt nhất, trigger bởi thay đổi size, position, add/remove DOM. Repaint: vẽ lại pixels không thay đổi layout (background, color). Composite: chỉ gộp layers (transform, opacity) — rẻ nhất. Batching DOM reads/writes và dùng transform thay position để tránh reflow.",
      },
      {
        q: "Memory leak trong JavaScript là gì? Cách phát hiện?",
        a: "Memory leak: object không còn cần thiết nhưng vẫn có reference nên GC không thu hồi. Nguyên nhân phổ biến: event listener không remove, timer không clear, closure giữ reference lớn, global variables. Phát hiện: Chrome DevTools Memory tab, heap snapshot, Allocation timeline. React: luôn cleanup trong useEffect.",
      },
    ],
  },
  {
    id: 18,
    title: "Design Patterns",
    icon: "🧩",
    difficulty: "Nâng cao",
    progress: 63,
    description: "Patterns trong FE: HOC, render props, compound components, observer.",
    questions: [
      {
        q: "HOC, Render Props, Custom Hooks — khi nào dùng cái nào?",
        a: "HOC (Higher-Order Component): wrap component, inject props — dùng cho cross-cutting concerns (auth, analytics). Render Props: inject render function — linh hoạt nhưng verbose, có callback hell. Custom Hooks: cách hiện đại nhất để tái sử dụng logic stateful, compose dễ, test dễ. Ưu tiên Custom Hooks trong React modern.",
      },
      {
        q: "Compound Component Pattern là gì?",
        a: "Chia component phức tạp thành nhiều sub-component cộng tác với nhau qua shared state (Context). Ví dụ: <Select><Select.Trigger /><Select.Content><Select.Item /></Select.Content></Select>. Linh hoạt, API tự nhiên, consumer kiểm soát layout. Shadcn/Radix dùng pattern này rộng rãi.",
      },
      {
        q: "Observer Pattern trong FE dùng ở đâu?",
        a: "EventEmitter (Node.js), addEventListener (DOM), Subject/Observable (RxJS), Zustand subscriptions, React Context. IntersectionObserver: theo dõi element vào viewport (lazy load, infinite scroll). MutationObserver: theo dõi DOM changes. ResizeObserver: theo dõi element size thay đổi.",
      },
    ],
  },
  {
    id: 19,
    title: "Internationalization",
    icon: "🌍",
    difficulty: "Trung cấp",
    progress: 70,
    description: "i18n, l10n, RTL support, next-intl — build app cho người dùng toàn cầu.",
    questions: [
      {
        q: "i18n vs l10n khác nhau thế nào?",
        a: "i18n (Internationalization): thiết kế app để hỗ trợ nhiều ngôn ngữ/locale — cấu trúc code, tách string ra file riêng. l10n (Localization): dịch và adapt nội dung cho một locale cụ thể — dịch text, format ngày giờ, tiền tệ, số. i18n làm một lần, l10n làm cho từng ngôn ngữ.",
      },
      {
        q: "RTL (Right-to-Left) support cần chú ý gì?",
        a: "Dùng CSS Logical Properties thay vì physical: margin-inline-start thay vì margin-left, padding-block thay vì padding-top/bottom. Tailwind hỗ trợ rtl: variant. Set dir='rtl' trên html element. Icons directional (forward/back arrow) cần flip. Text alignment tự động theo dir attribute. Test với Arabic, Hebrew content.",
      },
      {
        q: "Pluralization và date/number formatting xử lý thế nào?",
        a: "Pluralization: các ngôn ngữ có rule phức tạp (tiếng Nga có 3 dạng số nhiều). Dùng Intl.PluralRules hoặc thư viện (next-intl, i18next) để handle. Date/Number: dùng Intl.DateTimeFormat, Intl.NumberFormat — tự động handle locale-specific formatting (DD/MM/YYYY vs MM/DD/YYYY, dấu phẩy/chấm phân cách nghìn).",
      },
    ],
  },
  {
    id: 20,
    title: "PWA & Mobile Web",
    icon: "📱",
    difficulty: "Nâng cao",
    progress: 48,
    description: "Service Workers, offline support, installable apps, responsive patterns.",
    questions: [
      {
        q: "Service Worker là gì? Có thể làm gì?",
        a: "Service Worker: script chạy trong background, độc lập với page, intercept network requests. Khả năng: cache resources (offline support), background sync, push notifications, periodic background sync. Lifecycle: install → activate → fetch. Không có DOM access. Chỉ chạy trên HTTPS (hoặc localhost).",
      },
      {
        q: "App Shell Architecture là gì?",
        a: "Tách app thành shell (navigation, header, layout — ít thay đổi) và content (thay đổi thường xuyên). Shell được cache bởi Service Worker → load instantly offline. Content được fetch từ network khi online. Pattern này là nền tảng của PWA, cho UX gần giống native app.",
      },
      {
        q: "Responsive design modern — các kỹ thuật nào?",
        a: "Mobile-first với min-width breakpoints. Fluid typography: clamp(min, preferred, max). Container Queries cho component-level responsiveness. CSS Grid với auto-fill/auto-fit + minmax() tự động responsive không cần breakpoint. Intrinsic design: layout tự adapt mà không cần nhiều media queries. logical properties cho i18n compatibility.",
      },
    ],
  },
  {
    id: 21,
    title: "WebSocket & Real-time",
    icon: "📡",
    difficulty: "Nâng cao",
    progress: 58,
    description: "WebSocket, SSE, long polling, real-time patterns — dữ liệu live trên web.",
    questions: [
      {
        q: "WebSocket vs SSE vs Long Polling khác nhau thế nào?",
        a: "Long Polling: client gửi request, server giữ kết nối đến khi có data, client gửi request mới ngay sau. Đơn giản nhưng inefficient. SSE (Server-Sent Events): server push một chiều qua HTTP, auto-reconnect, dễ implement, phù hợp cho notifications/feeds. WebSocket: bidirectional full-duplex, low latency, phù hợp cho chat, game, collaborative editing.",
      },
      {
        q: "Làm thế nào để handle WebSocket reconnection?",
        a: "Implement exponential backoff: retry sau 1s, 2s, 4s, 8s... với jitter (thêm random để tránh thundering herd). Theo dõi readyState, lắng nghe onclose/onerror. Có thể dùng thư viện reconnecting-websocket. Khi reconnect, cần re-subscribe và đồng bộ lại state bị missed. Heartbeat ping/pong để detect silent disconnects.",
      },
      {
        q: "Làm sao scale real-time app với nhiều server?",
        a: "Vấn đề: WebSocket connection gắn với một server cụ thể. Giải pháp: Pub/Sub broker (Redis, Kafka) để broadcast message giữa các server. Sticky sessions nếu dùng load balancer. Hoặc dùng managed service (Pusher, Ably, Socket.io với Redis adapter). Stateless server + external message bus là pattern chuẩn để scale.",
      },
    ],
  },
  {
    id: 22,
    title: "Auth & Session",
    icon: "🔑",
    difficulty: "Nâng cao",
    progress: 65,
    description: "JWT, OAuth 2.0, PKCE, session management, token refresh strategy.",
    questions: [
      {
        q: "JWT nên lưu ở đâu — cookie hay localStorage?",
        a: "httpOnly cookie: không accessible qua JS, tự động gửi với request, bảo vệ XSS, cần CSRF protection (SameSite=Strict/Lax thường đủ). localStorage: dễ implement, nhưng accessible qua JS → dễ bị XSS đánh cắp token. Kết luận: httpOnly secure cookie là best practice cho auth tokens.",
      },
      {
        q: "OAuth 2.0 Authorization Code + PKCE flow là gì?",
        a: "PKCE (Proof Key for Code Exchange) thay thế implicit flow cho SPA. Flow: (1) tạo code_verifier (random string) + code_challenge (hash của verifier), (2) redirect đến auth server kèm challenge, (3) nhận authorization code, (4) exchange code + verifier lấy token. Không cần client secret, an toàn hơn implicit flow.",
      },
      {
        q: "Token refresh strategy — implement thế nào?",
        a: "Access token ngắn hạn (15-60 min), refresh token dài hạn (7-30 ngày). Khi access token hết hạn: silent refresh — tự động gọi /refresh trước khi token expire (dùng interval hoặc check khi gọi API). Refresh token rotation: mỗi lần refresh trả về refresh token mới, vô hiệu hóa cái cũ — phát hiện token theft.",
      },
    ],
  },
  {
    id: 23,
    title: "Error Handling",
    icon: "🛡️",
    difficulty: "Trung cấp",
    progress: 67,
    description: "Error boundaries, global error handling, monitoring, logging strategy.",
    questions: [
      {
        q: "Error Boundary trong React là gì?",
        a: "Class component catch JavaScript errors trong component tree con, hiển thị fallback UI thay vì crash toàn app. Dùng componentDidCatch và getDerivedStateFromError. Không catch: async errors, event handlers, server-side errors. react-error-boundary package cung cấp functional API tiện lợi hơn.",
      },
      {
        q: "Làm sao handle lỗi API một cách nhất quán?",
        a: "Centralized error handling tại HTTP client layer: intercept response errors, normalize error shape. Phân loại: network error (offline), 4xx (client error — hiển thị message), 5xx (server error — retry). React Query: onError callback, global QueryCache error handler. Tránh handle lỗi ad-hoc tại từng component.",
      },
      {
        q: "Frontend monitoring — cần theo dõi những gì?",
        a: "JavaScript errors: Sentry, Datadog — capture stack trace, user context, breadcrumbs. Performance: Core Web Vitals qua web-vitals library, gửi về analytics. User sessions: FullStory, LogRocket — replay lại session khi có bug. Custom events: business-critical actions (checkout, form submit). Error rate và P95 latency là KPIs cần alert.",
      },
    ],
  },
  {
    id: 24,
    title: "Code Quality",
    icon: "✅",
    difficulty: "Trung cấp",
    progress: 74,
    description: "SOLID, DRY, KISS, clean code — viết code maintainable và scalable.",
    questions: [
      {
        q: "SOLID trong Frontend áp dụng ra sao?",
        a: "S - Single Responsibility: component/function chỉ làm một việc. O - Open/Closed: extend behavior không sửa code gốc (composition, HOC). L - Liskov: component con có thể thay thế cha mà không break. I - Interface Segregation: props interface nhỏ, focused. D - Dependency Inversion: inject dependency (adapter pattern, port), không hardcode.",
      },
      {
        q: "Khi nào DRY thành anti-pattern?",
        a: "DRY (Don't Repeat Yourself) áp dụng sai: abstraction quá sớm khi code mới trông giống nhau nhưng thực ra diverge sau. Rule of three: chỉ abstract khi đã lặp lại 3 lần. WET (Write Everything Twice) đôi khi tốt hơn — hai function giống nhau nhưng evolve theo hướng khác nhau thì nên tách. Premature abstraction tạo ra coupling ngầm.",
      },
      {
        q: "Code review nên focus vào những gì?",
        a: "Correctness: logic đúng không, edge cases được handle không. Maintainability: naming rõ không, có cần comment không. Performance: có N+1 query, unnecessary re-render không. Security: input validation, XSS risk, exposed secrets không. Tests: coverage đủ không, test cases meaningful không. Architecture: đúng layer không, dependency direction đúng không.",
      },
    ],
  },
  {
    id: 25,
    title: "Algorithms & DS",
    icon: "📊",
    difficulty: "Trung cấp",
    progress: 62,
    description: "Big O, array/object operations, sorting, common patterns trong FE interviews.",
    questions: [
      {
        q: "Big O notation — các case phổ biến trong FE?",
        a: "O(1): object property access, array index. O(n): loop qua array, Array.find. O(n²): nested loop — cần tránh với data lớn. O(log n): binary search. Thực tế FE: flatMap/reduce O(n), sort O(n log n), Object.keys + map = O(n). Set/Map lookup O(1) — dùng để tối ưu từ O(n²) về O(n).",
      },
      {
        q: "Các array method hay dùng và độ phức tạp?",
        a: "map/filter/reduce/forEach: O(n). find/findIndex: O(n) worst case. includes: O(n) array, O(1) Set. sort: O(n log n). flat/flatMap: O(n*d) với d là depth. Array.from + Set để dedup O(n). splice O(n) — shift/unshift chậm hơn push/pop vì phải reindex. Prefer immutable operations trong React.",
      },
      {
        q: "Debounce và throttle — implement từ đầu?",
        a: "Debounce: function trả về wrapper, wrapper dùng setTimeout + clearTimeout. Mỗi lần gọi reset timer. Throttle: lưu lastCall timestamp, chỉ execute nếu thời gian từ lastCall > delay. Leading vs trailing edge: debounce có thể fire lần đầu ngay lập tức (leading) hoặc sau delay (trailing). Lodash implementation là reference tốt.",
      },
    ],
  },
  {
    id: 26,
    title: "Styling Approaches",
    icon: "💅",
    difficulty: "Trung cấp",
    progress: 71,
    description: "CSS Modules, Tailwind, CSS-in-JS, styled-components — trade-offs và khi nào dùng.",
    questions: [
      {
        q: "Tailwind vs CSS Modules vs CSS-in-JS — chọn gì?",
        a: "Tailwind: utility-first, nhanh, không cần đặt tên class, bundle nhỏ (PurgeCSS), khó read với nhiều utilities. CSS Modules: scoped CSS, quen thuộc, tách biệt rõ, tốt cho component library. CSS-in-JS (styled-components, Emotion): dynamic styles dựa trên props, TypeScript tốt, runtime overhead. Tailwind + shadcn là stack phổ biến 2024-2025.",
      },
      {
        q: "CSS-in-JS có vấn đề gì với SSR?",
        a: "Runtime CSS-in-JS inject styles lúc render → với SSR cần extract CSS trên server và embed vào HTML. Một số libraries (Emotion, styled-components) có server-side rendering API. Zero-runtime CSS-in-JS (Linaria, vanilla-extract) compile sang static CSS lúc build — không có runtime overhead, SSR không vấn đề. Xu hướng đang shift về zero-runtime.",
      },
      {
        q: "Tại sao Tailwind CSS bundle size nhỏ trong production?",
        a: "Tailwind scan toàn bộ source files, chỉ include CSS của classes thực sự được dùng (PurgeCSS/content config). Bundle production thường chỉ 5-20KB gzip. Development bundle đầy đủ có thể vài MB. Safelist để giữ dynamic class names không bị purge. Cần đảm bảo không construct class names động (e.g., 'text-' + color).",
      },
    ],
  },
  {
    id: 27,
    title: "Functional Programming",
    icon: "λ",
    difficulty: "Nâng cao",
    progress: 55,
    description: "Pure functions, immutability, composition, functors — FP trong JavaScript.",
    questions: [
      {
        q: "Pure function là gì? Tại sao quan trọng?",
        a: "Pure function: (1) cùng input luôn cho cùng output, (2) không có side effects. Lợi ích: predictable, testable, cacheable (memoizable), parallelizable. React component nên là pure function của props/state. Redux reducer phải pure. Immer giúp viết 'mutating' code mà vẫn produce immutable result.",
      },
      {
        q: "Immutability quan trọng thế nào trong React/Redux?",
        a: "React dùng reference equality để detect change. Mutate trực tiếp object/array → reference không đổi → React không biết cần re-render. Redux: reducer phải return state mới, không mutate state cũ. Spread operator, Array.map/filter trả về array mới. Immer cho phép viết mutation syntax mà produce immutable update.",
      },
      {
        q: "Function composition và currying là gì?",
        a: "Composition: kết hợp nhiều function f(g(h(x))). Pipe (trái sang phải) vs Compose (phải sang trái). Currying: biến function nhiều args thành chain function một arg: add(1)(2). Partial application: fix một số args trước. Ứng dụng thực tế: middleware chain (Express, Redux), event handler composition, data transformation pipelines.",
      },
    ],
  },
  {
    id: 28,
    title: "CI/CD cho Frontend",
    icon: "🚢",
    difficulty: "Trung cấp",
    progress: 68,
    description: "GitHub Actions, preview deployments, automated testing, release strategy.",
    questions: [
      {
        q: "CI/CD pipeline cho FE app gồm những bước gì?",
        a: "CI: lint → type-check → unit/integration tests → build. CD: deploy preview environment (Vercel/Netlify per-PR) → E2E tests trên preview → manual approval (nếu cần) → deploy production. Monorepo: dùng Turborepo remote cache để chỉ build package thay đổi. Fail fast: type-check và lint trước, test sau.",
      },
      {
        q: "Preview deployments mang lại giá trị gì?",
        a: "Mỗi PR có URL riêng để review visual, test manual trước khi merge. Không cần setup local để review PR. Designer, PM có thể review trực tiếp. E2E tests chạy trên môi trường production-like. Giảm bugs đến production. Vercel, Netlify, Cloudflare Pages đều support out of the box.",
      },
      {
        q: "Feature flags trong FE — implement thế nào?",
        a: "Feature flags cho phép deploy code ẩn, bật dần dần (canary release, A/B testing). Implement: environment variables (đơn giản, cần redeploy), remote config (LaunchDarkly, GrowthBook, Flagsmith — runtime, không cần redeploy). Pattern: if (flags.newDashboard) return <NewDashboard /> else return <OldDashboard />. Kill switch cho rollback instant.",
      },
    ],
  },
  {
    id: 29,
    title: "Monorepo & Tooling",
    icon: "🏢",
    difficulty: "Nâng cao",
    progress: 60,
    description: "Turborepo, PNPM workspaces, package versioning, dependency management.",
    questions: [
      {
        q: "Turborepo giải quyết vấn đề gì trong monorepo?",
        a: "Build orchestration thông minh: (1) Task graph — chỉ build package phụ thuộc đã thay đổi, (2) Local cache — không build lại output đã có, (3) Remote cache — chia sẻ cache giữa CI và local machine, (4) Parallel execution — tối đa hóa CPU usage. Kết quả: CI time giảm 40-80% trên large monorepo.",
      },
      {
        q: "PNPM workspace khác npm/yarn workspace thế nào?",
        a: "PNPM dùng content-addressable store + hard links: mỗi package version chỉ lưu một lần trên disk, symlinked vào projects. Nhanh hơn npm install, tiết kiệm disk. Strict dependency isolation: package chỉ access dependencies đã declare (phantom dependency problem). pnpm-lock.yaml reproducible hơn npm/yarn.",
      },
      {
        q: "Versioning packages trong monorepo — Changesets làm gì?",
        a: "Changesets workflow: dev tạo changeset file mô tả thay đổi (patch/minor/major). Khi merge: Changesets CI PR tự động tổng hợp, bump versions, update CHANGELOG. Publish packages lên npm. Giải quyết vấn đề: ai bump version, changelog từ đâu, package nào cần publish khi có thay đổi. Lerna, Nx cũng có workflow tương tự.",
      },
    ],
  },
  {
    id: 30,
    title: "Soft Skills & Behavioral",
    icon: "🗣️",
    difficulty: "Cơ bản",
    progress: 80,
    description: "STAR method, system design approach, câu hỏi behavioral thường gặp.",
    questions: [
      {
        q: "STAR method để trả lời câu hỏi behavioral là gì?",
        a: "Situation: bối cảnh và context. Task: nhiệm vụ bạn cần làm. Action: những gì BẠN cụ thể đã làm (dùng 'tôi', không phải 'chúng tôi'). Result: kết quả đo được, bài học rút ra. Ví dụ câu hỏi: 'Kể về lần bạn handle conflict với teammate', 'Kể về technical decision khó nhất', 'Khi nào bạn disagree với tech lead'.",
      },
      {
        q: "Approach một câu hỏi system design FE như thế nào?",
        a: "(1) Clarify requirements: user base, scale, features ưu tiên. (2) High-level design: components, data flow. (3) Deep dive: rendering strategy (CSR/SSR/SSG), state management, caching, performance. (4) Trade-offs: giải thích tại sao chọn approach này vs alternatives. (5) Failure modes: offline, slow network. Nói to suy nghĩ của bạn — interviewer muốn nghe thought process.",
      },
      {
        q: "Làm sao communicate về technical debt với non-technical stakeholders?",
        a: "Tránh jargon kỹ thuật. Dùng analogy: 'codebase như ngôi nhà cũ — có thể vẫn ở được nhưng mỗi renovation mất gấp đôi thời gian'. Frame theo business impact: 'feature X hiện tại mất 2 tuần, sau khi refactor chỉ mất 3 ngày'. Propose: debt item cụ thể + estimated effort + business benefit. Đưa vào sprint một phần nhỏ thay vì đợi big bang rewrite.",
      },
    ],
  },
  {
    id: 31,
    title: "TypeScript Nâng Cao",
    icon: "🔷",
    difficulty: "Nâng cao",
    progress: 58,
    description: "Conditional types, infer, mapped types, template literal — TypeScript level cao.",
    questions: [
      {
        q: "Conditional types và infer dùng để làm gì?",
        a: "Conditional types: T extends U ? X : Y — cho phép branching logic trong type system. infer: trích xuất type từ trong một type khác. Ví dụ: type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never. Ứng dụng: Awaited<T> unwrap Promise, Parameters<T> lấy args của function.",
      },
      {
        q: "Mapped types là gì? Cho ví dụ thực tế.",
        a: "Mapped types transform từng property của một type. Cú pháp: { [K in keyof T]: ... }. Ví dụ: Partial<T> = { [K in keyof T]?: T[K] }. Readonly<T> = { readonly [K in keyof T]: T[K] }. Kết hợp với conditional: { [K in keyof T]: T[K] extends string ? K : never }[keyof T] — lấy tất cả keys có value là string.",
      },
      {
        q: "Template Literal Types dùng khi nào?",
        a: "Tạo string type từ combination của types khác. Ví dụ: type EventName = `on${Capitalize<string>}` → 'onClick', 'onChange'. type CSSProp = `${string}-${string}`. Ứng dụng thực tế: type-safe event names, API endpoint typing, CSS property names, i18n key paths như 'auth.login.title'. Rất mạnh khi kết hợp với mapped types.",
      },
      {
        q: "Declaration merging là gì?",
        a: "TypeScript cho phép nhiều declarations cùng tên merge lại. Interface merging: hai interface cùng tên tự động merge properties — dùng để extend third-party types (augmentation). Module augmentation: thêm methods vào existing module. Global augmentation: thêm vào Window, Process. Ví dụ: extend Express Request để thêm user property.",
      },
    ],
  },
  {
    id: 32,
    title: "Forms & Validation",
    icon: "📋",
    difficulty: "Trung cấp",
    progress: 73,
    description: "React Hook Form, Zod, form patterns phức tạp, UX tốt cho form.",
    questions: [
      {
        q: "React Hook Form tốt hơn controlled form ở điểm nào?",
        a: "Controlled form (useState): re-render mỗi keystroke, code verbose. React Hook Form: uncontrolled by default — register input, không re-render khi type, performance tốt hơn đáng kể. Validation tích hợp, error state quản lý sẵn, hỗ trợ Zod/Yup resolver. Với form lớn (20+ fields), difference rõ rệt.",
      },
      {
        q: "Zod schema validation kết hợp với React Hook Form thế nào?",
        a: "Định nghĩa schema với Zod: z.object({ email: z.string().email(), age: z.number().min(18) }). Dùng @hookform/resolvers/zod làm resolver. Type inference: type FormData = z.infer<typeof schema> — không cần viết type riêng. Validation message tự động từ Zod. Single source of truth cho cả type và validation logic.",
      },
      {
        q: "Dynamic form fields — thêm/xóa field dynamically?",
        a: "React Hook Form có useFieldArray hook: append(), remove(), swap(), move(). Mỗi field có unique id (quan trọng cho React key). Nested field arrays: fields trong fields. Validation: array-level (min length) và item-level. Pattern phổ biến: invoice với line items, multi-step form, form builder.",
      },
    ],
  },
  {
    id: 33,
    title: "Micro Animations",
    icon: "🎭",
    difficulty: "Trung cấp",
    progress: 52,
    description: "Animation principles, Framer Motion, CSS transitions, performance-aware motion.",
    questions: [
      {
        q: "12 nguyên tắc animation của Disney áp dụng cho UI thế nào?",
        a: "Squash & Stretch: element scale khi bounce. Anticipation: hint trước action (button nhấn xuống trước khi bay lên). Follow Through: element tiếp tục move một chút sau khi stop. Ease In/Out: acceleration và deceleration tự nhiên — tránh linear. Overlapping Action: các phần khác nhau của object animate ở tốc độ khác nhau. UI animation tốt = subtle, purpose-driven, không distracting.",
      },
      {
        q: "Framer Motion — layout animation là gì?",
        a: "Layout animation tự động animate khi element thay đổi vị trí/size trong DOM — chỉ cần thêm layout prop. Shared layout animation: element 'di chuyển' giữa hai vị trí khác nhau trong DOM (layoutId). AnimatePresence: animate khi component unmount (exit animation). Không cần tính toán coordinates thủ công.",
      },
      {
        q: "Khi nào animation gây hại cho UX?",
        a: "Animation quá dài (> 300ms cho UI feedback). Blocking interaction (user không thể click trong lúc animate). Loop vô tận gây distraction. Không respect prefers-reduced-motion (người dùng vestibular disorders). Animate layout-triggering properties (width, height, top, left) thay vì transform. Rule: animate để communicate, không để impress.",
      },
    ],
  },
  {
    id: 34,
    title: "GraphQL",
    icon: "◉",
    difficulty: "Nâng cao",
    progress: 55,
    description: "Schema, queries, mutations, subscriptions, Apollo Client, N+1 problem.",
    questions: [
      {
        q: "GraphQL giải quyết vấn đề gì mà REST không làm được?",
        a: "Over-fetching: REST trả về toàn bộ resource dù client chỉ cần vài fields. Under-fetching: cần nhiều request để lấy đủ data. GraphQL: client khai báo chính xác data cần, server trả về đúng đó. Single endpoint. Strongly-typed schema là contract giữa FE và BE. Introspection cho phép auto-generate types, documentation.",
      },
      {
        q: "N+1 problem trong GraphQL là gì?",
        a: "Khi resolve một list, mỗi item trigger thêm query riêng. Ví dụ: query 10 posts + author của mỗi post = 1 + 10 = 11 queries. Giải pháp: DataLoader — batch và cache requests trong cùng một tick. Nhiều posts cùng author chỉ query author một lần. Facebook phát minh DataLoader chính vì vấn đề này.",
      },
      {
        q: "Apollo Client cache hoạt động thế nào?",
        a: "Normalized cache: store objects theo id (typename + id), không lưu theo query. Khi query User:1 từ nhiều queries khác nhau, chỉ lưu một lần. Update cache sau mutation: evict, modify, hoặc refetchQueries. Optimistic response: update cache ngay trước khi server confirm. Cache policies: cache-first, network-only, cache-and-network.",
      },
    ],
  },
  {
    id: 35,
    title: "React Native",
    icon: "📲",
    difficulty: "Trung cấp",
    progress: 48,
    description: "Bridge architecture, Expo, navigation, platform differences — React cho mobile.",
    questions: [
      {
        q: "React Native khác React web ở những điểm cơ bản nào?",
        a: "Không có DOM — dùng native components (View, Text, Image, ScrollView). Không có CSS — dùng StyleSheet.create với subset CSS properties, flexbox là default layout. Không có browser APIs. Bridge (cũ) hoặc JSI (mới) để communicate giữa JS thread và native thread. Platform-specific code: Platform.OS, .ios.tsx / .android.tsx file extensions.",
      },
      {
        q: "Expo vs Bare React Native — chọn gì?",
        a: "Expo Managed: không cần Xcode/Android Studio, OTA updates, expo-modules phong phú — phù hợp để start nhanh, 90% use cases. Expo Bare: có native code, dùng được mọi native module. Bare React Native: full control, cần setup native toolchain, phù hợp khi cần deep native integration. Recommendation: bắt đầu Expo Managed, eject khi cần.",
      },
      {
        q: "Performance optimization trong React Native?",
        a: "FlatList thay VirtualizedList cho large lists (chỉ render visible items). Memo, useCallback tránh re-render không cần thiết. Hermes engine (JS engine tối ưu cho RN). Reanimated 2: animation chạy trên UI thread, không qua JS bridge → 60fps. Tránh anonymous functions trong JSX. Flipper để profile và debug performance.",
      },
    ],
  },
  {
    id: 36,
    title: "Web Components",
    icon: "🧱",
    difficulty: "Nâng cao",
    progress: 42,
    description: "Custom Elements, Shadow DOM, HTML Templates — web platform native components.",
    questions: [
      {
        q: "Web Components gồm những công nghệ gì?",
        a: "Custom Elements: define HTML elements mới (<my-button>). Shadow DOM: encapsulated DOM và CSS, styles không leak ra ngoài. HTML Templates (<template>): markup không render ngay, dùng làm blueprint. HTML Imports (deprecated). Kết hợp lại tạo thành truly encapsulated, reusable components chạy trên mọi framework. Lit là thư viện phổ biến nhất để build Web Components.",
      },
      {
        q: "Shadow DOM giải quyết vấn đề gì?",
        a: "CSS encapsulation: styles trong Shadow DOM không affect DOM bên ngoài và ngược lại. Tránh CSS global pollution, specificity conflicts. Tuy nhiên: khó style từ bên ngoài (cần CSS custom properties hoặc ::part). Accessibility: screen readers vẫn traverse shadow DOM. Trade-off: encapsulation mạnh nhưng styling từ consumer bị hạn chế.",
      },
      {
        q: "Web Components vs React/Vue Components — dùng khi nào?",
        a: "Web Components phù hợp: design system muốn dùng across nhiều frameworks (React, Vue, Angular cùng dùng một button component), widget embed vào third-party sites. Không phù hợp: app phức tạp cần state management, server-side rendering (shadow DOM vẫn có hạn chế với SSR). Framework components nhanh để build hơn, Web Components portable hơn.",
      },
    ],
  },
  {
    id: 37,
    title: "JavaScript Engine",
    icon: "⚙️",
    difficulty: "Nâng cao",
    progress: 45,
    description: "V8, JIT compilation, hidden classes, garbage collection — hiểu JS runtime.",
    questions: [
      {
        q: "V8 compile và optimize JavaScript thế nào?",
        a: "V8 pipeline: Parse → AST → Ignition (bytecode interpreter) → TurboFan (optimizing JIT compiler). Ignition chạy code ngay, profile hot functions. TurboFan compile hot functions sang machine code tối ưu. Deoptimization: khi assumption bị vi phạm (type change), V8 bail out về bytecode. Hiểu điều này giúp viết code 'V8-friendly'.",
      },
      {
        q: "Hidden classes và inline caching là gì?",
        a: "V8 tạo hidden class cho objects cùng shape (cùng properties theo cùng thứ tự). Objects cùng hidden class → fast property access. Tránh: thêm properties sau constructor, thay đổi property order, delete properties — mỗi lần làm vậy tạo hidden class mới. Monomorphic code (luôn cùng shape) nhanh hơn polymorphic code.",
      },
      {
        q: "Garbage Collection trong V8 hoạt động ra sao?",
        a: "Generational GC: Young generation (Scavenger — minor GC, nhanh), Old generation (Mark-Compact — major GC, chậm hơn). Objects sống sót qua vài minor GC → promote lên old generation. Orinoco: concurrent và incremental GC để giảm pauses. Idle-time GC: tận dụng lúc browser rảnh. Hiểu điều này để tránh memory leak và GC pressure.",
      },
    ],
  },
  {
    id: 38,
    title: "Data Visualization",
    icon: "📈",
    difficulty: "Trung cấp",
    progress: 50,
    description: "SVG, Canvas, D3.js, chart libraries — hiển thị data phức tạp trên web.",
    questions: [
      {
        q: "SVG vs Canvas — khi nào dùng cái nào?",
        a: "SVG: DOM-based, mỗi element có thể style CSS, handle events, scalable, tốt cho interactive charts và infographics với số lượng element vừa phải (<10k). Canvas: pixel-based, một element duy nhất, không có DOM overhead, tốt cho real-time animation và rất nhiều elements (maps, game, > 10k data points). WebGL: 3D và GPU-accelerated rendering.",
      },
      {
        q: "D3.js là gì và tại sao vừa mạnh vừa khó?",
        a: "D3 (Data-Driven Documents): bind data vào DOM, transform data thành visual marks. Mạnh vì: flexible tuyệt đối, không opinionate về chart type, xử lý scales/axes/transitions tốt. Khó vì: low-level API, D3 selection khác React model (mutate DOM trực tiếp). Trong React: thường dùng D3 chỉ cho math (scales, layouts, projections), React render DOM.",
      },
      {
        q: "Recharts vs Victory vs Nivo — chọn gì?",
        a: "Recharts: composable React components, dễ dùng, phổ biến nhất, dùng SVG. Victory: tương tự Recharts, có React Native version — tốt cho cross-platform. Nivo: đẹp hơn out-of-the-box, hỗ trợ SVG và Canvas và HTML, server-side rendering. ECharts (Apache): feature-rich nhất, hỗ trợ cực nhiều chart types. Với business dashboard: Recharts đủ dùng và ít học nhất.",
      },
    ],
  },
  {
    id: 39,
    title: "Security Nâng Cao",
    icon: "🛡️",
    difficulty: "Nâng cao",
    progress: 48,
    description: "CSP, SRI, supply chain attacks, dependency security, secure coding practices.",
    questions: [
      {
        q: "Content Security Policy (CSP) là gì?",
        a: "HTTP header cho phép whitelist nguồn được phép load resources (scripts, styles, images). Ngăn XSS bằng cách block inline scripts và unauthorized external scripts. Directives: script-src, style-src, connect-src, img-src. Nonce-based CSP: mỗi request tạo nonce ngẫu nhiên, chỉ scripts có nonce đó mới chạy. Report-only mode để test trước khi enforce.",
      },
      {
        q: "Supply chain attack trong FE là gì? event-stream incident?",
        a: "Supply chain attack: compromise package phổ biến để inject malicious code vào hàng triệu apps. event-stream (2018): attacker thêm malicious code vào npm package steal Bitcoin wallets. Phòng ngừa: lock versions (package-lock.json, pnpm-lock.yaml), audit dependencies (npm audit, Snyk), review changelogs trước khi upgrade, prefer packages với ít dependencies, dùng private registry với review.",
      },
      {
        q: "Subresource Integrity (SRI) là gì?",
        a: "SRI: thêm hash vào thẻ <script src> hoặc <link>, browser verify hash trước khi execute. Nếu CDN bị compromise và file thay đổi → hash không khớp → browser block. Ví dụ: integrity='sha384-...' crossorigin='anonymous'. Quan trọng khi load third-party scripts từ CDN. Tự động generate hash bằng openssl hoặc online tools.",
      },
    ],
  },
  {
    id: 40,
    title: "Career & Chuẩn Bị",
    icon: "🎯",
    difficulty: "Cơ bản",
    progress: 85,
    description: "Portfolio, open source, học như thế nào, đàm phán lương — roadmap thực tế.",
    questions: [
      {
        q: "Portfolio FE cần có gì để nổi bật?",
        a: "2-3 projects thực tế (không phải tutorial clone), mỗi project: live demo + source code + README giải thích technical decisions. Highlight: problem solved, tech stack và tại sao chọn, challenges gặp phải và giải quyết thế nào. Contributions vào open source (dù nhỏ). Personal website thể hiện CSS/design skills. Viết blog về điều đã học — demonstrate depth.",
      },
      {
        q: "Làm sao học hiệu quả khi có quá nhiều thứ cần học?",
        a: "T-shaped knowledge: broad awareness + deep expertise trong 2-3 lĩnh vực. Learn by building: project-based > tutorial. Deliberate practice: làm điều ngoài comfort zone, không chỉ làm điều đã biết. Feynman technique: giải thích concept cho người không biết — nếu không giải thích được là chưa thực sự hiểu. Consistency > intensity: 1h/ngày tốt hơn 8h/cuối tuần.",
      },
      {
        q: "Đàm phán lương — những điều FE developer nên biết?",
        a: "Research market rate: Levels.fyi, Glassdoor, LinkedIn Salary, hỏi người trong ngành. Luôn đưa ra number trước khi họ offer (anchor). Đừng chỉ negotiating base salary: RSU, signing bonus, remote work, learning budget, extra PTO cũng negotiate được. Frame theo value: 'dựa trên experience và market rate' thay vì 'tôi cần tiền'. Có competing offer là leverage tốt nhất.",
      },
    ],
  },
  {
    id: 41,
    title: "Rendering Patterns",
    icon: "🔁",
    difficulty: "Nâng cao",
    progress: 54,
    description: "Islands architecture, PPR, fine-grained reactivity, signals — tương lai của rendering.",
    questions: [
      {
        q: "Islands Architecture là gì?",
        a: "Render phần lớn page là static HTML, chỉ các 'islands' tương tác được hydrate bằng JS. Astro là framework phổ biến nhất dùng pattern này. Lợi ích: JS bundle tối thiểu, TTI cực nhanh. Khác RSC: Islands có ranh giới cứng, RSC có thể interleave server/client components linh hoạt hơn. Phù hợp cho content-heavy sites (docs, blog, marketing).",
      },
      {
        q: "Partial Prerendering (PPR) trong Next.js là gì?",
        a: "PPR kết hợp static shell với dynamic holes trong cùng một route. Shell được serve từ CDN ngay lập tức (static), dynamic parts stream vào sau. Không cần chọn giữa SSG và SSR cho toàn bộ route. Cơ chế: static parts prerender lúc build, <Suspense> boundaries mark dynamic parts, server stream vào khi có data. Game-changer cho performance.",
      },
      {
        q: "Signals và fine-grained reactivity khác React model thế nào?",
        a: "React: re-render toàn bộ component tree (với batching). Signals (Solid.js, Preact Signals): reactive primitives, chỉ update chính xác DOM node phụ thuộc vào signal — không có VDOM diffing. Kết quả: ít allocations, không cần memo/useCallback. Angular 16+ adopts Signals. Vue 3 reactivity cũng dùng concept tương tự. Trend: fine-grained reactivity đang ảnh hưởng cả React (React Forget compiler).",
      },
    ],
  },
  {
    id: 42,
    title: "Developer Tools",
    icon: "🔍",
    difficulty: "Cơ bản",
    progress: 76,
    description: "Chrome DevTools mastery, debugging strategies, network analysis, profiling.",
    questions: [
      {
        q: "Performance tab trong DevTools dùng để làm gì?",
        a: "Record runtime performance: xem flame chart, tìm long tasks (> 50ms block main thread), layout thrashing, forced synchronous layouts. Markers: User Timing API để annotate timeline tùy chỉnh. Identify: expensive JS execution, style recalculations, paint operations. INP debugging: tìm interaction → processing → rendering chain. Bottom-up vs call tree để locate bottleneck.",
      },
      {
        q: "Network tab — những gì cần chú ý khi optimize?",
        a: "Waterfall: identify blocking resources (render-blocking scripts/styles). Size vs Transfer size: compression ratio. Priority: browser resource loading priority có hợp lý không. Timing breakdown: TTFB, DNS, TCP, SSL. Simulate slow 3G để test real-world perf. Disable cache khi test. Filter by type: JS, CSS, XHR/Fetch riêng biệt. HAR export để share với team.",
      },
      {
        q: "Debugger statement và conditional breakpoints dùng thế nào?",
        a: "debugger statement trong code: execution pause khi DevTools mở. Conditional breakpoint: click breakpoint → Edit → thêm condition JS (e.g., userId === '123'). Logpoint: log mà không cần console.log trong code. XHR/Fetch breakpoint: break khi URL match pattern. Event listener breakpoint: break khi specific DOM event fire. Watch expressions: evaluate expressions tại mỗi pause.",
      },
    ],
  },
  {
    id: 43,
    title: "Edge & Serverless",
    icon: "☁️",
    difficulty: "Nâng cao",
    progress: 50,
    description: "Edge functions, Cloudflare Workers, edge databases, distributed computing cho FE.",
    questions: [
      {
        q: "Edge Runtime khác Node.js Runtime ở điểm nào?",
        a: "Edge Runtime: V8 isolates (không phải Node.js), subset Web APIs, startup cực nhanh (< 1ms cold start vs ~100ms Lambda), chạy gần user (PoPs toàn cầu), không có filesystem access, limited Node.js APIs. Phù hợp: middleware, auth checks, A/B testing, personalization, geo-routing. Node.js runtime: full power, file system, npm packages không giới hạn.",
      },
      {
        q: "Cloudflare Workers có gì đặc biệt?",
        a: "Chạy trên V8 isolates, không phải containers — cold start gần như 0. KV store cho key-value data ở edge. Durable Objects: stateful computation ở edge (WebSocket, coordination). R2 cho object storage không egress fee. D1 cho SQLite ở edge. Wrangler CLI cho local dev. Workers Sites để deploy static assets. Ecosystem đang grow nhanh, competitor với Vercel Edge Functions.",
      },
      {
        q: "Khi nào nên dùng edge functions thay vì server functions?",
        a: "Dùng edge: middleware (auth, redirects, headers), personalization dựa trên geo/device, A/B testing, rate limiting, static content serving. Không dùng edge khi: cần Node.js APIs, long-running computation, kết nối database không hỗ trợ edge (MySQL truyền thống), heavy npm packages. Nguyên tắc: edge = fast, simple logic; server = complex, full-featured.",
      },
    ],
  },
  {
    id: 44,
    title: "AI Integration",
    icon: "🤖",
    difficulty: "Trung cấp",
    progress: 56,
    description: "AI SDK, streaming text, prompt engineering cho FE, tích hợp LLM vào web app.",
    questions: [
      {
        q: "Streaming AI responses trong React hoạt động thế nào?",
        a: "Server dùng ReadableStream để stream tokens từng phần. Client đọc stream với reader.read() trong loop. Vercel AI SDK: useChat hook handle streaming tự động, cập nhật message state incrementally. React 18 Suspense và streaming tích hợp tốt. Key UX detail: hiển thị typing indicator, xử lý incomplete JSON trong stream, handle network interruption và resume.",
      },
      {
        q: "Prompt engineering cơ bản mà FE dev cần biết?",
        a: "System prompt: set context, persona, constraints cho model. Few-shot examples: cho model thấy input/output mẫu. Chain-of-thought: yêu cầu model 'think step by step' → kết quả chính xác hơn. Structured output: yêu cầu JSON format cụ thể, validate với Zod. Temperature: 0 cho deterministic output, cao hơn cho creative. Token counting: tránh exceed context window.",
      },
      {
        q: "RAG (Retrieval-Augmented Generation) là gì từ góc độ FE?",
        a: "RAG: tìm documents liên quan từ knowledge base, đưa vào context của LLM prompt. FE implementation: user query → embed query (vector) → similarity search trong vector DB → lấy relevant chunks → feed vào LLM. Frontend cần: UI cho document upload, search results display, source citation. Vector DB options: Pinecone, Supabase pgvector, Cloudflare Vectorize.",
      },
    ],
  },
  {
    id: 45,
    title: "E2E Testing Nâng Cao",
    icon: "🎭",
    difficulty: "Nâng cao",
    progress: 60,
    description: "Playwright patterns, Page Object Model, visual regression, contract testing.",
    questions: [
      {
        q: "Page Object Model (POM) trong Playwright là gì?",
        a: "Encapsulate page interactions vào class: thay vì locator logic rải rác trong tests, tập trung vào Page Object. Ví dụ: LoginPage class có methods login(username, password), getErrorMessage(). Tests chỉ gọi page methods, không biết locator details. Lợi ích: tests dễ đọc, locator change chỉ cần sửa 1 chỗ. Playwright có fixtures để inject page objects.",
      },
      {
        q: "Visual regression testing là gì?",
        a: "Chụp screenshot component/page, so sánh với baseline. Detect unexpected visual changes (layout shift, color change, font change). Tools: Playwright screenshot assertion, Chromatic (Storybook), Percy, Applitools. Workflow: PR tạo screenshot diff, developer approve nếu intentional change. Trade-off: flaky khi có dynamic content (dates, animations) — cần mock.",
      },
      {
        q: "Contract testing (Pact) khác integration testing thế nào?",
        a: "Integration test: test real API calls — chậm, cần backend running. Contract testing: FE define 'contract' (expected request/response), Pact verify FE assumptions là đúng với backend spec. FE tests run locally với mock matching contract. BE tests verify contract against real implementation. Phát hiện breaking changes trước khi deploy. Tốt cho microservices và separate FE/BE teams.",
      },
    ],
  },
  {
    id: 46,
    title: "OOP trong JavaScript",
    icon: "🏛️",
    difficulty: "Trung cấp",
    progress: 65,
    description: "Classes, prototype inheritance, encapsulation, OOP patterns trong JS/TS.",
    questions: [
      {
        q: "Class trong ES6 là gì? Có gì khác prototype?",
        a: "ES6 class là syntactic sugar trên prototype-based inheritance — không có 'real classes' như Java/C#. class keyword tạo constructor function và prototype chain giống hệt. Private fields (#field): true encapsulation từ ES2022. Static methods: gắn vào class, không phải instance. super() gọi parent constructor. Thực tế: class dễ đọc hơn, nhưng cần hiểu prototype để debug.",
      },
      {
        q: "Mixins pattern trong JavaScript là gì?",
        a: "Giải quyết vấn đề JavaScript single inheritance. Mixin: object chứa methods, copy vào class target: Object.assign(Target.prototype, Mixin). Hoặc dùng higher-order class: const Serializable = (Base) => class extends Base { serialize() {...} }. Tránh diamond problem của multiple inheritance. TypeScript: implement multiple interfaces + mixin cho implementation.",
      },
      {
        q: "Khi nào OOP phù hợp hơn FP trong FE?",
        a: "OOP phù hợp: modeling complex domain entities với state và behavior (game objects, editor nodes), plugin systems, framework internals (React class components, Angular services). FP phù hợp: data transformation pipelines, UI rendering (React functional model), pure business logic. Thực tế: kết hợp cả hai — OOP cho domain modeling, FP cho data transformation.",
      },
    ],
  },
  {
    id: 47,
    title: "WebAssembly",
    icon: "⚡",
    difficulty: "Nâng cao",
    progress: 38,
    description: "WASM basics, use cases trong web, khi nào FE developer cần biết.",
    questions: [
      {
        q: "WebAssembly là gì và tại sao quan trọng?",
        a: "WASM: binary instruction format chạy trong browser ở near-native speed. Compile từ C/C++/Rust/Go. Không thay thế JavaScript — bổ sung cho computationally expensive tasks. Sandbox security như JS. Use cases: image/video processing (FFmpeg.wasm), game engines (Unity/Unreal), CAD, scientific computation, database engines (SQLite in browser). FE dev không cần viết WASM nhưng cần biết dùng WASM modules.",
      },
      {
        q: "Figma, Google Earth dùng WASM thế nào?",
        a: "Figma: render engine viết bằng C++, compile sang WASM — 60fps vector graphics manipulation trong browser không thể đạt được với JS thuần. Google Earth: toàn bộ rendering engine (C++ codebase lớn) compile sang WASM. Squoosh (Google): image compression algorithms (libwebp, mozjpeg) chạy trong browser via WASM. Pattern chung: heavy computation logic porting từ native app sang web.",
      },
      {
        q: "Dùng WASM module từ JavaScript thế nào?",
        a: "WebAssembly.instantiateStreaming(fetch('module.wasm'), imports) để load và compile. Module export functions gọi được từ JS. Giới hạn: WASM chỉ làm việc với numbers (integers, floats) — string, object phải serialized qua memory. wasm-bindgen (Rust) và Emscripten (C++) tự động generate JS glue code. npm packages ngày càng nhiều WASM internals ẩn đằng sau API quen thuộc.",
      },
    ],
  },
  {
    id: 48,
    title: "Regex & Xử Lý String",
    icon: "🔤",
    difficulty: "Trung cấp",
    progress: 66,
    description: "Regular expressions, string methods, parsing, common patterns trong FE.",
    questions: [
      {
        q: "Regex — các syntax cần nhớ cho FE developer?",
        a: "Anchors: ^ (start), $ (end). Quantifiers: * (0+), + (1+), ? (0-1), {n,m}. Groups: () capture, (?:) non-capture, (?=) lookahead, (?<=) lookbehind. Character classes: \\d digit, \\w word char, \\s whitespace, . any char. Flags: g (global), i (case insensitive), m (multiline). Common patterns: email, URL validation, slug generation, extract tokens.",
      },
      {
        q: "String methods quan trọng trong modern JS?",
        a: "replaceAll(): replace tất cả occurrences (trước đây cần regex /g). matchAll(): iterator của tất cả matches kèm capture groups. at(): negative indexing (str.at(-1) = last char). trimStart/trimEnd(). padStart/padEnd(): format numbers '007'. String.raw: template literal không process escape. Intl.Segmenter: split string theo grapheme clusters (emoji đúng), không phải code units.",
      },
      {
        q: "Xử lý Unicode và emoji trong JS — những cạm bẫy?",
        a: "JS string dùng UTF-16: emoji thường là surrogate pairs (2 code units). str.length đếm code units, không phải characters — '😀'.length === 2. Array.from('😀').length === 1 (đúng). [...str] spread cũng đúng. slice() có thể tách surrogate pair. Intl.Segmenter mới nhất handle grapheme clusters đúng nhất (family emoji: 👨‍👩‍👧 là 8 code units, 1 grapheme).",
      },
    ],
  },
  {
    id: 49,
    title: "Performance APIs",
    icon: "📏",
    difficulty: "Nâng cao",
    progress: 45,
    description: "Performance Observer, Navigation Timing, User Timing API — đo performance chính xác.",
    questions: [
      {
        q: "Performance Observer API dùng để làm gì?",
        a: "Subscribe nhận performance entries theo type: largest-contentful-paint, first-input, layout-shift, longtask, resource, navigation. Thay thế performance.getEntries() polling. Ví dụ: đo LCP thực tế của user, gửi về analytics. web-vitals library (Google) dùng PerformanceObserver internally. Tốt hơn setTimeout hack vì browser notify khi entry available.",
      },
      {
        q: "User Timing API dùng thế nào để đo custom metrics?",
        a: "performance.mark('feature-start') và performance.mark('feature-end') để đánh dấu. performance.measure('feature-duration', 'feature-start', 'feature-end') tính khoảng cách. Kết quả xuất hiện trong DevTools Performance timeline. Gửi về monitoring: performance.getEntriesByName('feature-duration')[0].duration. Dùng để measure: time-to-interactive cho specific features, custom loading stages.",
      },
      {
        q: "Long Tasks và INP — đo và optimize thế nào?",
        a: "Long Task: JS execution > 50ms block main thread. PerformanceObserver observe 'longtask' entries. INP (Interaction to Next Paint): time từ user interaction đến next paint. Optimize: break long tasks thành chunks với yield (setTimeout 0, scheduler.yield). Move computation off main thread (Web Workers). Lazy initialize heavy libraries. DevTools INP debugger tab để identify bottleneck interaction.",
      },
    ],
  },
  {
    id: 50,
    title: "Tương Lai Frontend",
    icon: "🚀",
    difficulty: "Nâng cao",
    progress: 42,
    description: "React Compiler, Turbopack, View Transitions API, CSS Houdini — xu hướng 2025+.",
    questions: [
      {
        q: "React Compiler (React Forget) giải quyết vấn đề gì?",
        a: "Tự động memo hóa components và values — không cần viết useMemo/useCallback thủ công. Compiler phân tích code, biết chính xác khi nào cần re-render mà không cần programmer hint. Compiler đảm bảo correctness tốt hơn developer viết tay (không bỏ sót dependency). Đang deploy dần ở Instagram. Tương lai: viết React 'naive' mà vẫn performant.",
      },
      {
        q: "View Transitions API là gì?",
        a: "Browser native API để animate giữa các DOM states với CSS transitions đẹp. document.startViewTransition(() => updateDOM()). Browser chụp state cũ, apply state mới, animate giữa hai state. Cross-document transitions (different pages): chỉ cần @view-transition CSS. Tạo app-like page transitions mà trước đây cần JS animation library phức tạp. Chrome support, đang được implement trên Safari/Firefox.",
      },
      {
        q: "CSS Houdini mang lại gì cho FE developers?",
        a: "Houdini: tập APIs expose CSS engine cho JavaScript. Paint Worklet: custom CSS background/border bằng Canvas API (CSS.paintWorklet.addModule). Layout API: custom layout algorithm. Properties & Values API: CSS custom properties with types, animation support. Typed OM: thao tác CSS values type-safe thay vì string manipulation. Animation Worklet: animations không bị block bởi main thread. Phần lớn vẫn experimental nhưng Paint API đã stable trên Chrome.",
      },
    ],
  },
];

const DIFFICULTY_COLOR: Record<Difficulty, string> = {
  "Cơ bản": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  "Trung cấp": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  "Nâng cao": "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
};

const PROGRESS_COLOR: Record<Difficulty, string> = {
  "Cơ bản": "[&>div]:bg-green-500",
  "Trung cấp": "[&>div]:bg-blue-500",
  "Nâng cao": "[&>div]:bg-purple-500",
};

export default function FEInterviewPage() {
  const [activeTab, setActiveTab] = useState("all");

  const filtered = activeTab === "all"
    ? TOPICS
    : TOPICS.filter((t) => t.difficulty === activeTab);

  const counts = {
    all: TOPICS.length,
    "Cơ bản": TOPICS.filter((t) => t.difficulty === "Cơ bản").length,
    "Trung cấp": TOPICS.filter((t) => t.difficulty === "Trung cấp").length,
    "Nâng cao": TOPICS.filter((t) => t.difficulty === "Nâng cao").length,
  };

  const avgProgress = Math.round(
    TOPICS.reduce((sum, t) => sum + t.progress, 0) / TOPICS.length,
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-10">

        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs font-mono tracking-wider">
              /fe-interview
            </Badge>
            <Badge variant="outline" className="text-xs text-muted-foreground">
              Nội bộ
            </Badge>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">
            Frontend Interview Guide
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            10 chủ đề cốt lõi cho phỏng vấn frontend engineer.
            Từ nền tảng đến system design — đủ để tự tin bước vào bất kỳ buổi phỏng vấn nào.
          </p>
        </div>

        <Separator />

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Chủ đề", value: "10", sub: "topics" },
            { label: "Câu hỏi", value: `${TOPICS.reduce((s, t) => s + t.questions.length, 0)}`, sub: "questions" },
            { label: "Tiến độ TB", value: `${avgProgress}%`, sub: "coverage" },
            { label: "Cấp độ", value: "3", sub: "levels" },
          ].map(({ label, value, sub }) => (
            <Card key={label} className="text-center py-2">
              <CardHeader className="pb-1 pt-4">
                <CardTitle className="text-3xl font-bold">{value}</CardTitle>
                <CardDescription className="text-xs uppercase tracking-wider">{label}</CardDescription>
              </CardHeader>
              <CardContent className="pb-4">
                <span className="text-xs text-muted-foreground font-mono">{sub}</span>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-full max-w-md">
            <TabsTrigger value="all">Tất cả ({counts.all})</TabsTrigger>
            <TabsTrigger value="Cơ bản">Cơ bản ({counts["Cơ bản"]})</TabsTrigger>
            <TabsTrigger value="Trung cấp">Trung cấp ({counts["Trung cấp"]})</TabsTrigger>
            <TabsTrigger value="Nâng cao">Nâng cao ({counts["Nâng cao"]})</TabsTrigger>
          </TabsList>

          {["all", "Cơ bản", "Trung cấp", "Nâng cao"].map((tab) => (
            <TabsContent key={tab} value={tab} className="mt-6">
              <div className="grid gap-6">
                {filtered.map((topic) => (
                  <Card key={topic.id} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{topic.icon}</span>
                          <div>
                            <CardTitle className="text-lg flex items-center gap-2">
                              {topic.title}
                              <span className="text-sm font-normal text-muted-foreground font-mono">
                                #{String(topic.id).padStart(2, "0")}
                              </span>
                            </CardTitle>
                            <CardDescription className="mt-0.5">
                              {topic.description}
                            </CardDescription>
                          </div>
                        </div>
                        <Badge className={DIFFICULTY_COLOR[topic.difficulty]}>
                          {topic.difficulty}
                        </Badge>
                      </div>

                      {/* Progress */}
                      <div className="mt-3 space-y-1">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Độ phủ nội dung</span>
                          <span className="font-mono">{topic.progress}%</span>
                        </div>
                        <Progress
                          value={topic.progress}
                          className={`h-1.5 ${PROGRESS_COLOR[topic.difficulty]}`}
                        />
                      </div>
                    </CardHeader>

                    <Separator />

                    <CardContent className="pt-0">
                      <Accordion type="multiple" className="w-full">
                        {topic.questions.map((qa, i) => (
                          <AccordionItem
                            key={i}
                            value={`${topic.id}-${i}`}
                            className="border-b last:border-0"
                          >
                            <AccordionTrigger className="text-sm text-left hover:no-underline py-3">
                              <span className="flex items-start gap-2">
                                <span className="text-muted-foreground font-mono text-xs mt-0.5 shrink-0">
                                  Q{i + 1}
                                </span>
                                <span>{qa.q}</span>
                              </span>
                            </AccordionTrigger>
                            <AccordionContent className="text-sm text-muted-foreground leading-relaxed pl-7">
                              {qa.a}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Footer */}
        <Separator />
        <p className="text-center text-xs text-muted-foreground font-mono">
          satellite-control-fe · fe-interview · {TOPICS.length} topics · {TOPICS.reduce((s, t) => s + t.questions.length, 0)} questions
        </p>
      </div>
    </div>
  );
}
