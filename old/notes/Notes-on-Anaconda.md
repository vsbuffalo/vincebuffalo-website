Title: Notes on Anaconda
Date: 2017-08-28
Category: notes

I've been [wary of
Anaconda](https://twitter.com/vsbuffalo/status/901856178824548352) but recently I've
employed it to manage an environment shared between my OS X development
machine and [bonjovi](https://www.youtube.com/watch?v=dQw4w9WgXcQ), our Coop
Lab server. Overall, I think it's good technology as it greatly helps in
minimizing time spent on installing software — which gets annoying as a
scientist. Below are some of my notes on how to build up a project's
environment up from scratch. 

## General Tips

Here are some general things to keep in mind -- these are things I learned the
hard way.

1. Don't install Anaconda on OS X for all users -- permissions will be wacky
   and cause issues.

2. Don't use `conda env export -n your-env` to create `environment.yml` files
   for creating environments for a project across different operating systems.
     Conda may install OS-specific dependencies, which hinders portability.
     Instead handcraft a **minimal environment YAML** file with only top-level
     project dependencies (more on this below). Then, only use `conda env
     export -n your-env > project_depends.yml` for saving the versions of all
     dependencies for reproducibility reasons, *not* to 
     reconstruct your environment on a different machine (thanks [Joshua
     Shapiro](https://twitter.com/jashapiro/status/902259307248582656) and
     [Jaime Ashander](https://twitter.com/jaimedash/status/902260033127190529)
     for this advice).

## Channels

Channels are like Homebrew's kegs. You can add a new channel with:

```bash
$ conda config --add channels r
$ conda config --add channels bioconda
$ conda config --add channels conda-forge
```

These are the essential channels as far as I know.

## Building an environment interactively

Each project needs its own environment (or a general environment, e.g. one for
all projects requiring scipy, iPython, numpy, and R). Below I quick cover how I
build up an environment.

### Create a new environment

First, let's create an example new environment, with only Python 3 and R:

```bash
$ conda create -n rpy-base python=3.6.2 r=3.4.1
```

Now, we see this new environment:

```bash
$ conda env list
# conda environments:
#
default-fwdpy11          /Users/vinceb/anaconda/envs/default-fwdpy11
rpy-base                 /Users/vinceb/anaconda/envs/rpy-base
root                  *  /Users/vinceb/anaconda
```

The asterisk indicates we're currently using the root environment. This means
all programs executed will use your default `$PATH` that looks in the usual
places (.e.g `/usr/local/bin`).

Now, we switch to our new environment:

```bash
$ source activate rpy-base
(rpy-base)
```

Note the `$PATH` now:

```bash
$ echo $PATH
/Users/vinceb/anaconda/envs/rpy-base/bin:/usr/local/bin [...]
(rpy-base)
```
Our anaconda environment is now first in our search `$PATH`. 

### Adding Packages

To add new packages to a specific environment (e.g. not the root environment), we use:

```bash
$ conda install install -n rpy-base r-tidyverse
```

This will ask you to proceed. After installation is complete, we see this R
package (and its dependencies) are now in the environment:

```bash
$ conda list
# packages in environment at /Users/vinceb/anaconda/envs/rpy-base:
#
[...]
r-tidyverse               1.1.1                  r3.4.1_0    r
```

### Saving the Conda environment

Now, we can export the environment to a
[YAML](https://en.wikipedia.org/wiki/YAML) file which can be used to mirror the
environment elsewhere. **However, this is not recommended for maintaining
project environments**. The reason is that `conda env export` returns all
packages *and their dependencies* installed, some of which may be OS X-specific
and not portable to Linux servers. A better approach is to maintain a
**minimal** list of packages used by your project, and let Conda find the
appropriate dependencies on whatever machine it's being run on. Then, the
following can be used to make a manifest of the versions per system (for
reproducibility, not for mirroring an environment):

```bash
$ conda env export -n rpy-base > project_depends.yml
```

Ideally, then **hand edit** `project_depends.yml` to include only the minimal dependencies. We'll call this `rpy-base.yml` — here is a minimal version example:

```
name: rpy-base
channels:
- conda-forge
- bioconda
- r
- defaults
dependencies:
- python=3.6.2=0
- r=3.4.1=r3.4.1_0
- r-tidyverse=1.1.1=r3.4.1_0
```

### Loading a Conda environment

This clones a new repo:
```bash
$ conda env create -n rpy-base2 -f rpy-base.yml
```

which we see with:
```bash
$ conda env list
# conda environments:
#
default-fwdpy11          /Users/vinceb/anaconda/envs/default-fwdpy11
rpy-base              *  /Users/vinceb/anaconda/envs/rpy-base
rpy-base2                /Users/vinceb/anaconda/envs/rpy-base2
root                     /Users/vinceb/anaconda
```

which we can now use `source activate rpy-base2` to use. 

### Removing an environment

Here's how to delete an environment, such as the cloned environment `rpy-base2` we just created.

```bash
$ conda env remove rpy-base2
```

and now it's gone:

```bash
$ conda env list
# conda environments:
#
default-fwdpy11          /Users/vinceb/anaconda/envs/default-fwdpy11
rpy-base              *  /Users/vinceb/anaconda/envs/rpy-base
root                     /Users/vinceb/anaconda
```

### Python notebook hacks

Here's an simple example script I use to start a Jupyter notebook kernel on a
server that can be accessed locally through [SSH
forwarding](https://coderwall.com/p/ohk6cg/remote-access-to-ipython-notebooks-via-ssh).

```bash
#!/bin/bash

SERVER=bonjovi  # yes, bonjovi is the name of my server

if [[ "$1" == "client" ]]; then
   echo "setting up ssh forwarding..."
   ssh -N -f -L localhost:8888:localhost:8890 $SERVER || (echo "error: ssh forwarding failed." && exit 1)
   exit
fi

if [[ $# -lt 2 ]]; then
   echo "usage: bash launch_notebook.sh notebook.ipynb [server]"
   exit 1
fi
source activate default-fwdpy11


if [[ "$2" == "server" ]]; then
   jupyter notebook "$1" --no-browser --port=8890
else
   jupyter notebook "$1"
fi
```

