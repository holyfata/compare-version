#!/bin/zsh

# 定义项目根目录
PROJECT_ROOT=/Users/heyongqi10/Github/compare-version/

# 复制[README.md, CHANGELOG.md, LICENSE]到jnpm目录
cp $PROJECT_ROOT/README.md $PROJECT_ROOT/jnpm/README.md
cp $PROJECT_ROOT/CHANGELOG.md $PROJECT_ROOT/jnpm/CHANGELOG.md
cp $PROJECT_ROOT/LICENSE $PROJECT_ROOT/jnpm/LICENSE

# 复制dist目录到jnpm目录
rm -rf $PROJECT_ROOT/jnpm/dist
cp -r $PROJECT_ROOT/dist $PROJECT_ROOT/jnpm/dist

# 用项目根目录下package.json的版本替换jnpm目录下package.json的版本
ROOT_VERSION=$(jq -r '.version' $PROJECT_ROOT/package.json)
jq --arg version "$ROOT_VERSION" '.version = $version' $PROJECT_ROOT/jnpm/package.json > $PROJECT_ROOT/jnpm/package.json.tmp
mv $PROJECT_ROOT/jnpm/package.json.tmp $PROJECT_ROOT/jnpm/package.json

# 发包
nrm use jd
npm publish
