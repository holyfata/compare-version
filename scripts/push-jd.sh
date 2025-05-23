git add .
git commit -m 'chore: push after release'

# 获取当前分支
CURRENT_BRANCH=$(git branch --show-current)

git push jd $CURRENT_BRANCH
