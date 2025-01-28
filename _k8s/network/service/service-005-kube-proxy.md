---
title: "Service 与 Kube-Proxy 的实现原理"
sequence: "105"
---

```text
$ sudo iptables -nvL OUTPUT -t nat
Chain OUTPUT (policy ACCEPT 893 packets, 53580 bytes)
 pkts bytes target     prot opt in     out     source               destination         
17582 1055K cali-OUTPUT  all  --  *      *       0.0.0.0/0            0.0.0.0/0            /* cali:tVnHkvAo15HuiPy0 */
17659 1060K KUBE-SERVICES  all  --  *      *       0.0.0.0/0            0.0.0.0/0            /* kubernetes service portals */
 9597  576K DOCKER     all  --  *      *       0.0.0.0/0           !127.0.0.0/8          ADDRTYPE match dst-type LOCAL
```

```text
$ sudo iptables -nvL KUBE-SERVICES -t nat
Chain KUBE-SERVICES (2 references)
 pkts bytes target     prot opt in     out     source               destination         
    0     0 KUBE-SVC-ERIFXISQEP7F7OF4  tcp  --  *      *       0.0.0.0/0            10.96.0.10           /* kube-system/kube-dns:dns-tcp cluster IP */ tcp dpt:53
    0     0 KUBE-SVC-JD5MR3NA4I4DYORP  tcp  --  *      *       0.0.0.0/0            10.96.0.10           /* kube-system/kube-dns:metrics cluster IP */ tcp dpt:9153
    0     0 KUBE-SVC-I24EZXP75AX5E7TU  tcp  --  *      *       0.0.0.0/0            10.104.77.103        /* calico-apiserver/calico-api:apiserver cluster IP */ tcp dpt:443
    0     0 KUBE-SVC-NPX46M4PTMTKRN6Y  tcp  --  *      *       0.0.0.0/0            10.96.0.1            /* default/kubernetes:https cluster IP */ tcp dpt:443
    0     0 KUBE-SVC-TCOU7JCQXEZGVUNU  udp  --  *      *       0.0.0.0/0            10.96.0.10           /* kube-system/kube-dns:dns cluster IP */ udp dpt:53
    0     0 KUBE-SVC-RK657RLKDNVNU64O  tcp  --  *      *       0.0.0.0/0            10.99.51.209         /* calico-system/calico-typha:calico-typha cluster IP */ tcp dpt:5473
    0     0 KUBE-SVC-UQPXAWV6W7FTSXDM  tcp  --  *      *       0.0.0.0/0            10.107.181.221       /* default/svc-nginx cluster IP */ tcp dpt:8000     # 注意，这里是 svc-nginx
   47  2820 KUBE-NODEPORTS  all  --  *      *       0.0.0.0/0            0.0.0.0/0            /* kubernetes service nodeports; NOTE: this must be the last rule in this chain */ ADDRTYPE match dst-type LOCAL
```

```text
$ sudo iptables -nvL KUBE-SVC-UQPXAWV6W7FTSXDM -t nat
Chain KUBE-SVC-UQPXAWV6W7FTSXDM (2 references)
 pkts bytes target     prot opt in     out     source               destination         
    0     0 KUBE-MARK-MASQ  tcp  --  *      *      !10.244.0.0/16        10.107.181.221       /* default/svc-nginx cluster IP */ tcp dpt:8000
    0     0 KUBE-SEP-2E75XXRTHOQKK74H  all  --  *      *       0.0.0.0/0            0.0.0.0/0            /* default/svc-nginx -> 10.244.167.207:80 */ statistic mode random probability 0.25000000000
    0     0 KUBE-SEP-PBJIK3G4NFJBGOY5  all  --  *      *       0.0.0.0/0            0.0.0.0/0            /* default/svc-nginx -> 10.244.167.208:80 */ statistic mode random probability 0.33333333349
    0     0 KUBE-SEP-AX26CIDLMY7LXC7M  all  --  *      *       0.0.0.0/0            0.0.0.0/0            /* default/svc-nginx -> 10.244.203.14:80 */ statistic mode random probability 0.50000000000
    0     0 KUBE-SEP-K25K3MF5IM37W2H4  all  --  *      *       0.0.0.0/0            0.0.0.0/0            /* default/svc-nginx -> 10.244.203.16:80 */
```

```text
0.25
(1 - 0.25) * 0.33333333349 = 0.25
(1 - 0.25 - 0.25) * 0.5 = 0.25
```
