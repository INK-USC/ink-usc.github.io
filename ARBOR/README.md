# ARBOR project page

Served at https://inklab.usc.edu/ARBOR.

- `index.html`: the landing page (Nerfies-style template, Bulma), with the paper's Figure 1 and Figure 3, the
  abstract, and the table of the eleven failure rows; each row links to its demo page.
- `demo/`: a frozen copy of the interactive demo (one page per failure row). It is generated, not edited by hand:
  in the `reasoning-trace-analysis/demo` repository run `python3 v3/build/build_v3.py` and then
  `python3 v3/build/freeze_site.py`, which copies `v3/out/R*.html` here and points the back button at this page.
- `static/images/teaser.png`, `figure3.png`: rendered from the paper's `images/teaser-figure.pdf` and `figure3.pdf`
  (Ghostscript, 220 dpi, cropped). `tree-thumb.png`: a crop of the R1 demo page at its second step.

Paper: https://arxiv.org/abs/2610.22717.
