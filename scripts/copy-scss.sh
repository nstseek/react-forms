 find $1/ -type f -name "*.scss" | sed "s/$1\//$2\//g" | xargs -n 1 mkdir -v -p
 find $1/ -type f -name "*.scss" | sed "s/$1\//$2\//g" | xargs -n 1 rmdir -v
 find $1/ -type f -name "*.scss" | sed "s/$1\///g" | xargs -n 1 -I{} cp -v $1/{} $2/{}