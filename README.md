# supnetbot
A Discord/IRC bot for Supnetwork. Énorme et sec.
Made with love (and hate too, switch to discord already guys).

Requires Node 5.x

Oh, by the way: This project is licensed under GPLv3. More info in LICENSE.md
Any file that doesn't have a license header is by default under GPLv3

## Features (at least planned ones)
 - Discord <> IRC Message bridge
 - Twitter queries
 - Discord logging, in IRC format
 - Discord statistics (irc-eggdrop like)

## How to install
 - Configure everything in config.js (pretty self explanatory)
 - npm install
 - node ./server.js

Once config.js is configured, you can also use docker:
 - docker build -t supnetbot .
 - docker run --rm supnetbot

If you use the logger plugin, you should use a volume for the output dir

## Roadmap
 - Get a new name

## FAQ

I believe this will answer most of the questions I'll ever get asked about this.

### Isn't Supnetwork full of trolls?
Nah we're good. Mostly.

### Why on earth did you use Node
I wanted to check out ES6, and I don't think that the single threaded nature of it will be a problem for this.

### Why didn't you make this in Go

### Why didn't you make this in Kotlin/Java
I wasn't fond of Java as a server dependency.
And I don't like Gradle and maven! Kotlin is definitely on my list of stuff to try, but for Android.

### Why didn't you make this in PHP
☜(ﾟヮﾟ☜)

### Why didn't you make this in Swift/ObjC
I wish I could have, but Swift isn't really mature on Linux yet.
Also, there's no IRC/Discord lib for it, and writing that from scratch is out of scope for this project.

### Why didn't you make this in C
Just leave me alone already.

# License
Supnetbot - A FOSS IRC/Discord/YouNameIt Bot
Copyright (C) 2016 Arnaud Barisain-Monrose

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
