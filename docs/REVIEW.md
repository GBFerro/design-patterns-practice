# Review rubric

This file **is** the prompt. `./dp review <id>` prints it with the material attached: the
brief, the untouched suite, the code as it stands, the act-2 requirement, your `CHOICE.md` if
the exercise had one, and the `git log` of your route.

## Read this first, reviewer

**The published solutions are deliberately not in this package.** A reviewer holding the
answer key grades similarity instead of quality, and this repository's whole premise is that
more than one structure is right. So:

> **"I would have decomposed it differently" is not a finding.**

A finding is: something that will break, something that costs more than it buys, something
named in a way that misleads, or a claim the code makes and does not keep.

## The five criteria

### 1. Does the structure separate the axis that actually varies?

Not "is there a pattern". Ask what this code will be asked to do next, and whether the seam
is in that place. A pattern applied along the wrong axis is worse than no pattern, because it
adds indirection *and* fails to absorb the change.

Name the axis the structure protects, in one sentence. If you cannot, say so — that is itself
the finding.

### 2. Does the invariant exist exactly once?

The most common real defect, and it survives every automated check: the part that never
changes got copied into each variant. Three strategies that each re-implement the shared
procedure are the original problem with an interface painted on top, and the suite stays
green.

Count the copies. Say the number.

### 3. The route, not just the destination

**Most reviewers skip this one, so do it before you look at the code.** The `git log` is the
evidence that there were small steps with a green suite between them. A single commit called
"refactor" is a rewrite in costume — it may well have produced better code, and it did not
practise what was being practised.

Comment on the *shape of the log* first: how many commits, do the messages name moves, is
there a commit that closes act 1.

### 4. Is the knowledge owned in one place?

Lists of names, registries, dispatch tables, the set of valid cases. If the same knowledge is
written in two places, the bug is already there and only time separates you from it. Look
specifically for an error message that enumerates options a human maintained by hand.

### 5. What got worse?

The section that is almost always missing, and the one that makes a review worth reading. Ask
for it explicitly:

- **Lazy Element** — a class or file that holds one line and adds nothing.
- **Too many parameters** because the seam is in the wrong place.
- **Ping-pong** — following one call through six files to learn what happens.
- **Premature generality** — an extension point built for a change nobody asked for. In *this*
  repository that is the cardinal sin, because the repo's own thesis is that patterns are
  purchases and over-buying is the common failure.
- **Readability traded away** — the version before was often easier to read end to end. If it
  was, say so. A review that presents the restructuring as free is not telling the truth.

## After act 2

If the reviewee has done act 2, two extra questions, and they are the sharpest ones available:

1. **Did `./dp trade` come in under budget, and does the reviewee's explanation of *why* match
   what the diff actually shows?** A budget met for a different reason than claimed is a
   misunderstanding that will resurface.
2. **For a `choices/` exercise: compare `CHOICE.md` with what act 2 cost.** The reviewee wrote
   down their reasoning *before* the discriminator arrived. Was the reasoning right, was it
   right for the wrong reason, or did it miss? This is the single most useful piece of feedback
   this repository can produce — do not skip it to comment on naming.

## Output

Lead with the log (criterion 3). Then the findings, most serious first, each with a concrete
consequence — inputs and the resulting wrong behaviour, or the change that will be expensive
and why. Then, separately, **what got worse**. Then anything you are unsure about, flagged as
unsure.

If there is nothing serious, say that plainly and stop. Padding a review with style notes
teaches the reviewee that reviews are noise.

## Per-exercise emphasis

Each exercise's `meta.json` carries `reviewFocus` — the three to five questions that matter
most there. `./dp review` prints them above the material. Weigh them harder than the generic
five, and say which one you weighed hardest.
