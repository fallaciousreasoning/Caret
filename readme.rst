Caret Web
====

This is a fork of https://github.com/thomaswilburn/Caret intended to run as a PWA (with offline support and native file system access). A live version is available on Github Pages https://fallaciousreasoning.github.io/Caret/.

Currently requires Chrome with the Native File System API flag (native-file-system-api) flipped in order to work.

There are a large number of Caret features I've disabled to get this working including but not limited to:

-  Context Menus (not sure how much work this will involve).
-  Reloading files when they have been updated on disk (The NativeFileSystemAPI always returns new Date() as the last modified date, which produces some weird behavior).
-  Asynchronous storage (currently I'm writing things to localStorage because it's easy).
-  All of the notifications stuff
-  Wiping data

Caret
=====

Caret is a lightweight-but-powerful programmer's editor running as a Chrome
Packaged App. Inspired by Sublime and built on top of the Ace editing
component, it offers:

-  multiple cursors
-  tabbed editing and retained files
-  syntax highlighting and themes
-  command palette/smart go to
-  hackable, synchronized configuration files
-  project files and folder view
-  fast project-wide string search

More information, links to Caret in the Chrome Web Store, and an
external package file are available at http://thomaswilburn.net/caret.
Documentation can be found in the
`wiki <https://github.com/thomaswilburn/Caret/wiki>`_.

You can also load Caret from source code, either to hack around on or
to try the absolute bleeding edge. You'll need to have Node and NPM
installed first, then follow these steps:

0. Clone this repo to your local machine
1. Run ``npm install`` to get the development dependencies (Grunt, LESS,
   and some other packages)
2. Run ``npm run build``, which will generate the CSS files from the LESS
   source
3. Visit ``chrome://extensions`` and enable Developer Mode.
4. Still on the extensions page, click the button marked "Load unpacked
   extension..." and select the directory containing Caret's
   manifest.json.

If you use Caret and would like to show your appreciation, please
consider donating to the `FSF's Fund to End Software
Patents <https://my.fsf.org/civicrm/contribute/transact?reset=1&id=17>`__.
