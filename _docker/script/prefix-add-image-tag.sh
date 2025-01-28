#!/bin/bash

# 执行 "docker images" 命令获取镜像信息，并格式化为 "Repository:Tag" 的形式输出
images=$(docker images --format "{{.Repository}}:{{.Tag}}")

target_content="calico"
newRepo="docker.lan.net:8083"

# 使用 $() 或 `` 符号获取命令输出的值

# 调用 for 循环，对镜像信息进行遍历
for image in $images
do
    # 检查字符串中是否包含特定内容
    if [[ ! "$image" == *"$target_content"* ]]; then
        # 如果包含特定内容，则跳过该字符串
        continue
    fi

    # 打印当前镜像信息
    echo "from:"
    echo "      ${image}";
    newImage="${newRepo}/${image}";
    echo "to:"
    echo "      ${newImage}";
    echo "docker tag ${image} ${newImage}";
    docker tag "${image}" "${newImage}";
    echo "docker push ${newImage}";
    docker push "${newImage}";
    echo "docker rmi ${newImage}";
    docker rmi "${newImage}";
done