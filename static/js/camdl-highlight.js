// Lightweight syntax highlighter for camdl code blocks.
// Tokenizes <code class="language-camdl"> and wraps tokens in spans using
// Chroma's class names so the existing site theme (light + dark) styles
// them automatically.
//
// Token classes match camdl.xml semantic tiers:
//   Block      -> k    (transitions, observations, ...)
//   Directive  -> kn   (let, stratify, time_unit, ...)
//   Control    -> k    (if, in, by, every, ...)
//   Action     -> k    (add, set, scale, ...)
//   Type       -> kt   (rate, probability, ...)
//   Builtin    -> nb   (sum, normal, periodic, ...)
//   Label      -> nf   (identifier before ':' inside label-blocks)
//   Operator   -> o    (-->, @)
//   Number     -> m
//   String     -> s
//   Unit       -> kt   ('days, 'per_year)
//   Comment    -> c1   (# ...)

(function () {
  const KW = {
    block: new Set([
      "transitions", "observations", "interventions", "tables", "scenarios",
      "events", "compartments", "parameters", "forcing", "ode", "output",
      "simulate", "init", "timepoints", "dimensions", "balance",
    ]),
    directive: new Set(["let", "stratify", "time_unit", "origin", "description"]),
    control: new Set([
      "if", "then", "else", "where", "in", "by", "only", "every", "at",
      "at_day", "from", "to", "format", "and", "or", "not",
    ]),
    action: new Set([
      "enable", "disable", "set", "scale", "compose", "transfer", "add",
      "label", "tag", "likelihood", "null",
    ]),
    type: new Set(["rate", "probability", "positive", "count", "real", "integer"]),
    builtin: new Set([
      "sum", "consecutive", "incidence", "prevalence", "cumulative", "max",
      "min", "overdispersed", "read", "date", "sinusoidal", "piecewise",
      "interpolated", "periodic", "neg_binomial", "poisson", "normal",
      "binomial", "beta_binomial", "bernoulli", "sqrt", "exp", "log",
      "deterministic",
    ]),
  };

  // Single combined tokenizer regex. Order matters: comment/string/unit
  // before identifiers; label lookahead before plain identifiers.
  const TOK = new RegExp(
    [
      "(#[^\\n]*)",                                              // 1 comment
      '("(?:[^"\\\\]|\\\\.)*")',                                  // 2 string
      "('[a-z_]+)",                                              // 3 unit
      "(\\d[\\d_]*\\.[\\d_]*(?:[eE][+-]?\\d+)?|\\d[\\d_]*(?:[eE][+-]?\\d+)?)", // 4 number
      "(-->|@)",                                                 // 5 operator
      "([a-zA-Z_]\\w*(?:\\[[^\\]]*\\])?)(?=\\s*:(?!:))",          // 6 label (id before single colon)
      "([a-zA-Z_]\\w*)",                                         // 7 identifier
    ].join("|"),
    "g"
  );

  function escapeHtml(s) {
    return s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function span(cls, text) {
    return '<span class="' + cls + '">' + escapeHtml(text) + "</span>";
  }

  function classifyIdent(word) {
    if (KW.block.has(word))     return "k";
    if (KW.directive.has(word)) return "kn";
    if (KW.control.has(word))   return "k";
    if (KW.action.has(word))    return "k";
    if (KW.type.has(word))      return "kt";
    if (KW.builtin.has(word))   return "nb";
    return null;
  }

  function highlight(src) {
    let out = "";
    let last = 0;
    let m;
    TOK.lastIndex = 0;
    while ((m = TOK.exec(src)) !== null) {
      if (m.index > last) out += escapeHtml(src.slice(last, m.index));
      const [, comment, str, unit, num, op, label, ident] = m;
      if (comment !== undefined)      out += span("c1", comment);
      else if (str !== undefined)     out += span("s",  str);
      else if (unit !== undefined)    out += span("kt", unit);
      else if (num !== undefined)     out += span("m",  num);
      else if (op !== undefined)      out += span("o",  op);
      else if (label !== undefined) {
        // label looks like `name` or `name[idx]` before ':'
        const head = label.match(/^([a-zA-Z_]\w*)(\[[^\]]*\])?$/);
        if (head && classifyIdent(head[1])) {
          // keyword that happens to precede `:` -> keep as keyword, not label
          out += span(classifyIdent(head[1]), head[1]);
          if (head[2]) out += escapeHtml(head[2]);
        } else {
          out += span("nf", label);
        }
      } else if (ident !== undefined) {
        const cls = classifyIdent(ident);
        out += cls ? span(cls, ident) : escapeHtml(ident);
      }
      last = m.index + m[0].length;
    }
    if (last < src.length) out += escapeHtml(src.slice(last));
    return out;
  }

  function paint() {
    document.querySelectorAll("code.language-camdl").forEach((el) => {
      if (el.dataset.camdlPainted === "1") return;
      el.innerHTML = highlight(el.textContent);
      el.dataset.camdlPainted = "1";
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", paint);
  } else {
    paint();
  }
})();
