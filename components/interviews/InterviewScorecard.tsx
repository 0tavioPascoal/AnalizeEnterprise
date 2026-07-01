// import type { ElementType } from "react";

// import {
//   BriefcaseBusiness,
//   ClipboardList,
//   MessageCircle,
//   ShieldCheck,
//   Sparkles,
//   Star,
//   UsersRound,
// } from "lucide-react";

// import type { InterviewGuideContent } from "@/actions/interviews/getInterviewById";

// import { cn } from "@/lib/supabase/utils";

// interface InterviewScorecardProps {
//   items: NonNullable<InterviewGuideContent["scorecard"]>;
//   compact?: boolean;
// }

// type ScorecardItem = NonNullable<InterviewGuideContent["scorecard"]>[number];

// const icons = [
//   BriefcaseBusiness,
//   UsersRound,
//   MessageCircle,
//   Sparkles,
//   ShieldCheck,
// ];

// export function InterviewScorecard({
//   items,
//   compact = false,
// }: InterviewScorecardProps) {
//   const weights = getWeights(items.length);
//   const total = weights.reduce((sum, value) => sum + value, 0);

//   if (compact) {
//     return (
//       <CompactScorecard items={items} weights={weights} total={total} />
//     );
//   }

//   return (
//     <section className="overflow-hidden rounded-[28px] border border-zinc-200/80 bg-white shadow-xl shadow-zinc-900/5 dark:border-zinc-800 dark:bg-zinc-900/90">
//       <div className="border-b border-zinc-200/80 bg-zinc-50/80 p-6 dark:border-zinc-800 dark:bg-zinc-950/40">
//         <div className="flex items-start gap-4">
//           <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-500/[0.08] text-violet-600 dark:bg-violet-500/[0.12] dark:text-violet-300">
//             <Star size={21} />
//           </div>

//           <div className="min-w-0">
//             <p className="text-xs font-black uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
//               Avaliação estruturada
//             </p>

//             <h2 className="mt-1 text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">
//               Scorecard sugerido
//             </h2>

//             <p className="mt-1.5 text-[15px] leading-7 text-zinc-500 dark:text-zinc-400">
//               Use estes critérios como base para avaliar o candidato durante e
//               após a entrevista.
//             </p>
//           </div>
//         </div>
//       </div>

//       <div className="p-6">
//         {items.length > 0 ? (
//           <div className="space-y-5">
//             <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
//               {items.map((item, index) => {
//                 const Icon = icons[index % icons.length];

//                 return (
//                   <ScoreBox
//                     key={`${getItemTitle(item, index)}-${index}`}
//                     icon={Icon}
//                     label={formatTitle(getItemTitle(item, index))}
//                     value={`${weights[index] ?? 0}%`}
//                   />
//                 );
//               })}

//               <ScoreBox
//                 icon={ClipboardList}
//                 label="Pontuação total"
//                 value={`${total}%`}
//                 highlight
//               />
//             </div>

//             <div className="rounded-2xl border border-sky-500/15 bg-sky-500/[0.06] p-5 dark:bg-sky-500/[0.08]">
//               <p className="text-[15px] font-medium leading-7 text-sky-700 dark:text-sky-300">
//                 O peso de cada critério foi distribuído automaticamente para
//                 apoiar uma avaliação objetiva e comparável entre candidatos.
//               </p>
//             </div>
//           </div>
//         ) : (
//           <EmptyScorecard />
//         )}
//       </div>
//     </section>
//   );
// }

// function CompactScorecard({
//   items,
//   weights,
//   total,
// }: {
//   items: NonNullable<InterviewGuideContent["scorecard"]>;
//   weights: number[];
//   total: number;
// }) {
//   if (items.length === 0) {
//     return (
//       <div className="flex min-h-24 items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-zinc-50/70 px-5 text-center text-sm font-semibold text-zinc-500 dark:border-zinc-700 dark:bg-zinc-950/40 dark:text-zinc-400">
//         Nenhum critério gerado.
//       </div>
//     );
//   }

//   return (
//     <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50/70 p-3 dark:border-zinc-800 dark:bg-zinc-950/40">
//       <div className="flex w-full min-w-0 items-stretch gap-3 overflow-x-auto pb-1">
//         {items.map((item, index) => {
//           const Icon = icons[index % icons.length];

//           return (
//             <CompactScoreBox
//               key={`${getItemTitle(item, index)}-${index}`}
//               icon={Icon}
//               label={formatTitle(getItemTitle(item, index))}
//               value={`${weights[index] ?? 0}%`}
//             />
//           );
//         })}

//         <CompactScoreBox
//           icon={ClipboardList}
//           label="Total"
//           value={`${total}%`}
//           highlight
//         />
//       </div>
//     </div>
//   );
// }

// function ScoreBox({
//   icon: Icon,
//   label,
//   value,
//   highlight,
// }: {
//   icon: ElementType;
//   label: string;
//   value: string;
//   highlight?: boolean;
// }) {
//   return (
//     <div
//       className={cn(
//         `
//         flex min-h-40 flex-col justify-between rounded-2xl border p-5
//         transition-all duration-200
//         hover:-translate-y-0.5 hover:shadow-lg hover:shadow-zinc-900/5
//         `,
//         highlight
//           ? "border-violet-500/20 bg-violet-500/[0.08]"
//           : "border-zinc-200/80 bg-white dark:border-zinc-800 dark:bg-zinc-950/40",
//       )}
//     >
//       <div
//         className={cn(
//           "mb-4 flex h-11 w-11 items-center justify-center rounded-2xl",
//           highlight
//             ? "bg-violet-500/[0.12] text-violet-700 dark:text-violet-300"
//             : "bg-sky-500/[0.08] text-sky-600 dark:bg-sky-500/[0.12] dark:text-sky-300",
//         )}
//       >
//         <Icon size={19} />
//       </div>

//       <p className="line-clamp-2 min-h-12 text-[15px] font-black leading-6 text-zinc-700 dark:text-zinc-200">
//         {label}
//       </p>

//       <p
//         className={cn(
//           "mt-4 font-black leading-none",
//           highlight
//             ? "text-4xl text-violet-700 dark:text-violet-300"
//             : "text-3xl text-zinc-900 dark:text-zinc-100",
//         )}
//       >
//         {value}
//       </p>
//     </div>
//   );
// }

// function CompactScoreBox({
//   icon: Icon,
//   label,
//   value,
//   highlight,
// }: {
//   icon: ElementType;
//   label: string;
//   value: string;
//   highlight?: boolean;
// }) {
//   return (
//     <div
//       className={cn(
//         `
//         flex min-h-28 min-w-32 flex-col justify-between rounded-2xl border
//         px-4 py-3 shadow-sm
//         `,
//         highlight
//           ? "border-violet-500/20 bg-violet-500/[0.10]"
//           : "border-zinc-200/80 bg-white dark:border-zinc-800 dark:bg-zinc-900/70",
//       )}
//     >
//       <div className="flex items-center justify-between gap-2">
//         <div
//           className={cn(
//             "flex h-8 w-8 items-center justify-center rounded-xl",
//             highlight
//               ? "bg-violet-500/[0.12] text-violet-700 dark:text-violet-300"
//               : "bg-sky-500/[0.10] text-sky-600 dark:text-sky-300",
//           )}
//         >
//           <Icon size={15} />
//         </div>

//         <p className="text-xl font-black text-zinc-900 dark:text-zinc-100">
//           {value}
//         </p>
//       </div>

//       <span className="mt-3 line-clamp-2 text-[11px] font-black uppercase leading-4 tracking-[0.12em] text-zinc-500 dark:text-zinc-400">
//         {label}
//       </span>
//     </div>
//   );
// }

// function EmptyScorecard() {
//   return (
//     <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50/70 p-8 text-center dark:border-zinc-700 dark:bg-zinc-950/40">
//       <p className="text-[15px] font-semibold text-zinc-500 dark:text-zinc-400">
//         Nenhum critério gerado.
//       </p>
//     </div>
//   );
// }

// function getWeights(totalItems: number): number[] {
//   if (totalItems <= 0) {
//     return [];
//   }

//   const base = Math.floor(100 / totalItems);
//   const remainder = 100 - base * totalItems;

//   return Array.from({ length: totalItems }, (_, index) =>
//     index === 0 ? base + remainder : base,
//   );
// }

// function getItemTitle(item: ScorecardItem, index: number): string {
//   return item.title?.trim() || `Critério ${index + 1}`;
// }

// function formatTitle(value: string): string {
//   return value
//     .replace("Conhecimento Técnico", "Técnico")
//     .replace("Experiência Prática", "Experiência")
//     .replace("Comunicação e Colaboração", "Comunicação")
//     .replace("Problema Solving e Análise", "Resolução de Problemas")
//     .replace("Problem Solving e Análise", "Resolução de Problemas")
//     .replace("Aprendizado e Adaptação", "Adaptação");
// }