Title: Scientific Development Workflows
Date: 2020-03-06
Category: notes

<em>Here are some general notes on my development workflow. I'm sharing these
in part because I recently taught my Jupyter + tmux workflow to a few
colleagues and they found it very helpful. I figured some general notes about
how I develop might be of general interest, so here they are.</em>

I prefer to develop locally on my MacBook Pro whenever possible. My local
[NeoVim installation](https://github.com/vsbuffalo/dotfiles/blob/master/.vimrc)
is customized to work best on OS X through iTerm2, so whenever I'm editing on a
server, I face both a less optimal editing experience and latency issues.
However, I occasionally do have to develop primarily on a server, for example,
if running a program takes too many resources or takes too long to run locally
on my laptop.

All projects have Github repos, which I keep private until a project is
preprinted. 

## Using Tmux When Developing on a Server

While I could develop locally and use git, rsync, or scp to sync code to a
server to run it, I find this tedious and time consuming. I much rather
develop directly on the server. After SSH'ing in, I need access to an editing
terminal tab, and a shell tab, and often many more tabs to get work done. To
emulate this on a server, I use [tmux](https://github.com/tmux/tmux) (tmux is
short for Terminal Multiplexer). Since often I work on a few (sometimes
related) projects at once, I use named tmux sessions:

```
$ tmux new -s <project_name>
```

Then I use `C-b c` to create new "tabs", `C-b p` to go to the previous tab, and
`C-b n` to go to the next tab (that's about 95% of the tmux I use, occasionally
I'll need to do something else, usually it's kill the current window if its
misbehaving, with `C-b &`). 

Note that tmux will maintain all these tabs even during connection loss. You
can intentionally detach a session with `C-b d`. Sessions can then be
reattached with:

```
$ tmux attach -t <project_name> 
```

## Running Jupyter Lab on a Notebook and Editing with Tmux

In the first tab, I often start a jupyter lab server instance, and then use SSH
to tunnel that session to my local browser. I use this to start Jupyter lab on
the server:

```
# activate the relevant conda environment
$ jupyter lab --no-browser --port=8890.  # a different port per project
```

Then on your local machine: 

```
$ ssh -Y -N -L localhost:8892:localhost:8892 <servername> &
# [I 05:36:08.592 LabApp] Use Control-C to stop this server and shut down all kernels (twice to skip confirmation).
# [C 05:36:08.613 LabApp]

#    To access the notebook, open this file in a browser:
#        file:///home/vsb/.local/share/jupyter/runtime/nbserver-55159-open.html
#    Or copy and paste one of these URLs:
#        http://localhost:8892/?token=a48d356da1967842146cbf9091aa7bd02fa04398eba02e12

$  /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --app='http://localhost:8892/?token=<token here>'
```

Where the token is the string Jupyter lab returns. Calling Google Chrome with
`--app=<url>` launches a new minimal window (e.g. now browser bar), which is
nice as it maximizes your notebook on the screen.

Note that you should be putting all your frequently used servers in
`.ssh/config` as named entries, so you can just do `ssh servername`.
Additionally, you should be using key-based authentication (all of this is
described in my
[book](https://www.amazon.com/Bioinformatics-Data-Skills-Reproducible-Research/dp/1449367372/ref=sr_1_2?keywords=bioinformatics+data+skills&qid=1582563206&sr=8-2)).

