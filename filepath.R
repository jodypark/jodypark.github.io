

# Install Quarto (if you haven't)
# macOS: brew install --cask quarto

install.packages(c("usethis","gitcreds"))

# assign
system("git config --global user.name 'Jody Park'")
system("git config --global user.email 'jodypark@psu.edu'")

# check it out
system("git config --global --list")

usethis::use_git()             # initializes git for this R Project & makes a first commit
usethis::use_github()  


# run this on terminal
echo "# jodypark.github.io" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/jodypark/jodypark.github.io.git
git push -u origin main



# 1) go to your project
cd "/Users/jodypark/Library/CloudStorage/Dropbox/github/jodypark.github.io"

# 2) make sure Dropbox keeps this folder offline (avoid placeholder files)
# (Do this in Finder: right-click folder → Dropbox → Make available offline)

# 3) init repo
git init

# 4) set your identity (one-time global; skip if already set)
git config --global user.name "Jody Park"
git config --global user.email "jodypark@psu.edu"



git add -A
git commit -m "Initial commit"