# Pocono Digital House

## SITE
- [poconodigitalhouse.github.io](https://poconodigitalhouse.github.io)

## Updating Videos
The videos are controlled by JS that reads data in the HTML.  To change the videos, edit the HTML.  There are notes next to each.
- Demo - `/index.html`
  - `href` is a link to the video on Vimeo.  If JS is disabled, clicking the demo button will take the user to Vimeo.
  - `data-demo-video-id` is the video's `vimeo_id`.  It's what JS uses to load the video in the modal.
- Home background - `/_layouts/default.html`
  - `data-bg-video-id` is the video's `vimeo_id`.  It's what JS uses to load the video into the background.

## Useful Links

Repo : [https://github.com/poconodigitalhouse/Pocono-Digital-House](https://github.com/poconodigitalhouse/Pocono-Digital-House)

Served : [https://poconodigitalhouse.github.io/Pocono-Digital-House](https://poconodigitalhouse.github.io/Pocono-Digital-House)

Local : [http://localhost:4000/](http://localhost:4000/)

Jekyll Docs : [https://jekyllrb.com/docs/home/](https://jekyllrb.com/docs/home/)

Jekyll & Github : [https://help.github.com/articles/using-jekyll-as-a-static-site-generator-with-github-pages/](https://help.github.com/articles/using-jekyll-as-a-static-site-generator-with-github-pages/)

Vimeo Player Api : [https://github.com/vimeo/player.js](https://github.com/vimeo/player.js)

GitHub Pages > Custom URL : [https://help.github.com/articles/using-a-custom-domain-with-github-pages/](https://help.github.com/articles/using-a-custom-domain-with-github-pages/)

GitHub / Jekyll / Markdown Helpers : [http://jmcglone.com/guides/github-pages/#resources](http://jmcglone.com/guides/github-pages/#resources)


## Setup

Is ruby installed
`ruby -v`

No? Install RVM
`curl -L https://get.rvm.io | bash -s stable`

Install Ruby (2.5.0 is the latest as of 4/1/18)
`rvm install ruby-2.5.0`

Set that Ruby to be the default
`rvm --default use 2.5.0`

Double-check that RubyGems is installed (it should be)
`gem -v`

Install Bundler
`gem install bundler`

(make sure you're in the repo root - with the `Gemfile`)

Install Jekyll et al.
`bundle install`

Start the server
`bundle exec jekyll serve --baseurl ''`

You're up an running
`http://localhost:4000/`


## Sublime Packages

- install a `jinja2` syntax package


## Dev Notes

- pages are `.html` files in the root
- pages *MUST* contain Front Matter
  ```
    ---
    layout: default
    ---
  ```
- custom Front Matter variables
  - `title`: used in the window title, appended to "Pocono Digital House" (e.g. `title: About` = `Pocono Digital House | About`);
  - `nav_theme`: sets the classname to use the light theme (white text) or the dark theme (dark-blue)
- Asset URLs in HTML look like this: `{{ '/path/to/file/from/root.md' | relative_url }}`
- Asset URLs in CSS looks like this: `$base-url + "/path/to/file/from/root.png"`
