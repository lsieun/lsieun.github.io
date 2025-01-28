#!/bin/bash

REPO="docker.lan.net:8083"

# 读取 input.txt 文件
while IFS= read -r line
do
    # 检查行是否为空
    if [ -z "$line" ]; then
        # 如果行为空，跳过
        continue
    fi

    # 检查行是否以 '#' 号开头
    if [[ "$line" == "#"* ]]; then
        # 如果行以 '#' 号开头，跳过
        continue
    fi

    # 输出非空且非以 '#' 号开头的行
    echo "$line"
    newImage="${REPO}/${line}";
    echo "docker pull ${newImage}";
    docker pull "${newImage}";
    echo "docker tag ${newImage}" ${line};
    docker tag "${newImage}" "${line}";
    echo "docker rmi ${newImage}";
    docker rmi "${newImage}";
    echo "=== === ===   === === ===   === === ===";
done < input.txt