---
title: "hosts"
sequence: "101"
---

[UP](/linux.html)


```text
$ sudo vi /etc/hosts
```

```text
192.168.80.100 liusen.cn
```

```text
$ sudo printf "\n192.168.15.93 k8s-control\n192.168.15.94 k8s-2\n\n" >> /etc/hosts
```

```text
$ sudo bash -c 'cat <<EOF>> /etc/hosts
192.168.80.131 master.kubernetes.lab 
192.168.80.231 worker01.kubernetes.lab
192.168.80.232 worker02.kubernetes.lab
EOF'
```

```text
echo -e "192.168.80.131 master.kubernetes.lab\n192.168.80.231 worker01.kubernetes.lab\n192.168.80.232 worker02.kubernetes.lab" | sudo tee -a /etc/hosts
```

```text
$ sudo tee -a /etc/hosts <<EOF
192.168.80.131 master01.k8s.lab
192.168.80.132 master02.k8s.lab
192.168.80.133 master03.k8s.lab
192.168.80.231 worker01.k8s.lab
192.168.80.232 worker02.k8s.lab
EOF
```

```text
$ sudo tee -a /etc/hosts <<EOF
192.168.80.131 server1
192.168.80.132 server2
192.168.80.133 server3
EOF
```
