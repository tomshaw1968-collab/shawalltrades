# shawalltrades.com

Source files for the Shaw All Trades website: a home page and an
"Our Projects" gallery that rebuilds itself automatically whenever a
new project folder is added.

## Adding a project to the gallery

1. Open the repo on GitHub.com and go into the `projects` folder.
2. Click **Add file → Upload files**, then drag in a folder of photos
   and/or videos for the job (or drag the files in one at a time into
   a new folder you create with **Create new file** → typing
   `project-name/placeholder.txt` first, then uploading the real files
   next to it and deleting the placeholder).
3. Name the folder after the job, e.g. `bishopbriggs-extension` or
   `Smith Roof Repair`. Spaces, capitals and dashes are all fine — the
   folder name becomes the title shown on the site.
4. Commit the upload to the `main` branch.
5. Within a minute or two, a "Rebuild projects gallery" check runs
   automatically (see the **Actions** tab) and updates the site. No
   coding, no local tools needed.

The first image in the folder (alphabetically) is used as the
thumbnail on the "Our Projects" page. JPG, PNG, GIF, WEBP, AVIF and
SVG are all treated as images; MP4, MOV, WEBM and M4V are treated as
videos. Anything else in the folder (a README, a text note) is
ignored.

There's a sample folder at `projects/example-project` so you can see
the layout working before real photos are in — delete it once you've
got real projects uploaded (see the README inside it).

## Running the gallery build yourself (optional)

You don't need to do this — the GitHub Action above handles it. But
if you ever want to check it locally with [Node.js](https://nodejs.org)
installed:

```
node scripts/build-projects-manifest.mjs
```

This scans `projects/` and rewrites `assets/projects.json`, which is
what `our-projects.html` reads to build the gallery.

## First-time setup (GitHub Pages)

Same process as the theredtriangle.co.uk site:

1. Create a new GitHub repository and upload all of these files to it
   (drag the whole folder into GitHub's "Add file → Upload files"
   screen, or push it if you're using git locally).
2. In the repo, go to **Settings → Pages**, set **Source** to
   "Deploy from a branch", branch `main`, folder `/ (root)`, and save.
3. GitHub will give you a `*.github.io` URL once it's built — check
   the site loads there first.
4. At your domain registrar, point `shawalltrades.com` at GitHub
   Pages: add the GitHub Pages A records (or a CNAME if you're using
   a `www` subdomain) as per
   [GitHub's custom domain docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site),
   and add a file named `CNAME` (no extension) at the root of the repo
   containing just `shawalltrades.com`.
5. In **Settings → Pages**, enter `shawalltrades.com` as the custom
   domain and enable "Enforce HTTPS" once it's available.

## What still needs filling in

- Swap in a logo if you'd like one — currently the header is just the
  wordmark.
- Delete `projects/example-project` once real project photos are
  uploaded.
