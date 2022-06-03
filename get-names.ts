// run this on the GauchoSpace 'People' page after filtering for student
// and pressing "Show all <# of classmates>"
[...document.querySelectorAll(`.d-inline-block.aabtn`)].map(el => el.textContent).join('\n')