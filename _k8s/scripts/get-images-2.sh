#!/bin/bash
url=registry.aliyuncs.com/google_containers
version=v1.27.3
images=(`kubeadm config images list --kubernetes-version=$version|awk -F '/' '{print $2}'`)
for imagename in ${images[@]} ; do
  docker pull $url/$imagename
  docker tag $url/$imagename registry.k8s.io/$imagename
  docker rmi -f $url/$imagename
done
