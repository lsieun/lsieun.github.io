---
title: "Jenkins + Nginx"
sequence: "jenkins-nginx"
---

## Jenkins

### 安装NodeJS Plugin 

NodeJS Plugin executes NodeJS script as a build step.

```text
H 9 * * 1-5
```

### Build

```text
pwd
node -v
npm install
npm run build

echo '构建完成'
ls
```

```text
pwd
node -v
yarn install
yarn run build

echo '构建完成'
ls
```

```text
mkfifo /path/to/pipe/mypipe
```

```text
mkfifo hostpipe
```

File: `execpipe.sh`

```text
#!/bin/bash
while true; do eval "$(cat /path/to/pipe/mypipe)" &> /somepath/output.txt; done
```

```text
#!/bin/bash
while true; do eval "$(cat /home/liusen/docker-compose/jenkins/hostpipe)" &> /home/liusen/docker-compose/jenkins/output.txt; done
```

```text
echo "rm -rf /home/liusen/site-content/*" > /hostpipe
echo "cp -r /home/liusen/docker-compose/jenkins/jenkins_configuration/workspace/vue3-deploy-demo/dist/* /home/liusen/site-content/" > /hostpipe
```

```text
pwd
node -v
yarn install
yarn run build

echo '构建完成'
ls
echo "rm -rf /home/liusen/site-content/*" > /hostpipe
echo "cp -r /home/liusen/docker-compose/jenkins/jenkins_configuration/workspace/vue3-deploy-demo/dist/* /home/liusen/site-content/" > /hostpipe
```
