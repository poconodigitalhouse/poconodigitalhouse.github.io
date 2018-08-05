# Pocono Digital House

## Useful Links

Repo : [https://github.com/poconodigitalhouse/Pocono-Digital-House](https://github.com/poconodigitalhouse/Pocono-Digital-House)

Served : [https://poconodigitalhouse.github.io/Pocono-Digital-House/html/](https://poconodigitalhouse.github.io/Pocono-Digital-House/html/)

Local : [http://localhost:4000/](http://localhost:4000/)

Jekyll Docs : [https://jekyllrb.com/docs/home/](https://jekyllrb.com/docs/home/)

Jekyll & Github : [https://help.github.com/articles/using-jekyll-as-a-static-site-generator-with-github-pages/](https://help.github.com/articles/using-jekyll-as-a-static-site-generator-with-github-pages/)

Vimeo Player Api : [https://github.com/vimeo/player.js](https://github.com/vimeo/player.js)

GitHub Pages > Custom URL : [https://help.github.com/articles/using-a-custom-domain-with-github-pages/](https://help.github.com/articles/using-a-custom-domain-with-github-pages/)

GitHub / Jekyll / Markdown Helpers : [http://jmcglone.com/guides/github-pages/#resources](http://jmcglone.com/guides/github-pages/#resources)


## TODO
### General
- favicon
- mobile-friendly
- open graph data
- google analytics
- scrub markup for seo
- break css into pieces
- refactor css : DRY, BEM, asset scrub

### GitHub Pages
- make username.github.io repo
- move this to there


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
`jekyll serve` || `bundle exec jekyll serve`

You're up an running
`http://localhost:4000/`


## Sublime Packages

- install a `jinja2` syntax package


## Notes

- pages are `.html` files in the root
- pages *MUST* contain Front Matter
  ```
    ---
    layout: default
    ---
  ```
- custom Front Matter variables
  - `title`: used in the window title, appended to "Pocono Digital House" (e.g. `title: About` = `Pocono Digital House | About`);
  - `bg_image`: the filename of an image file placed in the `/assets` folder that will be used as a background for that page
  - `type`: used to identify a specific page in the shared layout (e.g. replacing the background image with a video on the home page)
- Asset URLs in HTML look like this: `{{ '/path/to/file/from/root.md' | relative_url }}`
- Asset URLs in CSS looks like this: `$base-url + "/path/to/file/from/root.png"`
