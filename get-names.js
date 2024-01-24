// run this on the Canvas 'People' page after filtering for student
// and pressing "Show all <# of classmates>"
[...document.querySelectorAll(`.student_context_card_trigger`)]
  .map((a) => a.textContent)
  .map((t) => t.trim())
  .map((s) => s.replace(/ \(.*?\)/g, ""))
  .join("\n");
