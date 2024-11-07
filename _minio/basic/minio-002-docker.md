---
title: "MinIO Docker 应用部署"
sequence: "102"
---

## 环境搭建

第 1 步，为 CentOS7 开通服务器 ip_forward 功能：

```text
sudo vi /etc/sysctl.conf
```

```text
net.ipv4.ip_forward=1
vm.max_map_count=655360
```

第 2 步，创建 `macvlan80` 网络，让每个容器都拥有独立 IP：

```text
docker network create -d macvlan \
--subnet=192.168.80.0/24 \
--ip-range=192.168.80.0/24 \
--gateway=192.168.80.2 \
-o parent=ens32 \
macvlan80
```

第 3 步，创建三个 macvlan 容器：`192.168.80.240`~`192.168.80.242`，构建 macvlan 应用集群：


```text
$ mkdir -p ~/minio/{n240,n241,n242}/{export1,export2}
```

```text
docker run -d --name minio-240 \
--restart=always \
--network macvlan80 \
--ip=192.168.80.240 \
-v ~/minio/n240/export1:/export1 \
-v ~/minio/n240/export2:/export2 \
-e "MINIO_ROOT_USER=admin" \
-e "MINIO_ROOT_PASSWORD=a1b2c3d4" \
minio/minio server http://192.168.80.24{0...2}/export{1...2}
```

```text
docker run -d --name minio-241 \
--restart=always \
--network macvlan80 \
--ip=192.168.80.241 \
-v ~/minio/n241/export1:/export1 \
-v ~/minio/n241/export2:/export2 \
-e "MINIO_ROOT_USER=admin" \
-e "MINIO_ROOT_PASSWORD=a1b2c3d4" \
minio/minio server http://192.168.80.24{0...2}/export{1...2}
```

```text
docker run -d --name minio-242 \
--restart=always \
--network macvlan80 \
--ip=192.168.80.242 \
-v ~/minio/n242/export1:/export1 \
-v ~/minio/n242/export2:/export2 \
-e "MINIO_ROOT_USER=admin" \
-e "MINIO_ROOT_PASSWORD=a1b2c3d4" \
minio/minio server http://192.168.80.24{0...2}/export{1...2}
```

```text
All MinIO sub-systems initialized successfully
Waiting for all MinIO IAM sub-system to be initialized.. lock acquired
Status:         6 Online, 0 Offline. 
API: http://192.168.80.240:9000  http://127.0.0.1:9000 

Console: http://192.168.80.240:45799 http://127.0.0.1:45799
```

## 界面操作

### 登录

第 1 步，浏览器访问：

```text
http://192.168.80.240:9000/
```

![](/assets/images/minio/quick/minio-001.png)

第 2 步，查看 Dashboard：

![](/assets/images/minio/quick/minio-002-dashboard.png)

### Bucket

第 1 步，选择 Creat Bucket：

![](/assets/images/minio/quick/minio-003-create-bucket.png)

第 2 步，输入 Bucket Name：

![](/assets/images/minio/quick/minio-004-create-bucket.png)

### User

第 1 步，选择 Create User：

![](/assets/images/minio/quick/minio-005-create-user.png)

第 2 步，输入 Access key 和 Secret key，并选择 Policy：

![](/assets/images/minio/quick/minio-006-create-user.png)

![](/assets/images/minio/quick/minio-007-create-user.png)

第 3 步，查看 Users 列表：

![](/assets/images/minio/quick/minio-008-users.png)

## Spring Boot

### pom.xml

```xml
<dependency>
    <groupId>io.minio</groupId>
    <artifactId>minio</artifactId>
    <version>8.5.5</version>
</dependency>
```

### Code

```java
import io.minio.*;

import java.io.*;
import java.nio.charset.StandardCharsets;

public class FileUpload {
    public static void main(String[] args) throws Exception {
        String endpoint = "http://192.168.80.240:9000";
        String accessKey = "my-access-123";
        String secretKey = "my-secret-abc";
        MinioClient minioClient = MinioClient.builder()
                .endpoint(endpoint)
                .credentials(accessKey, secretKey)
                .build();

        //
        boolean isExist = minioClient.bucketExists(
                BucketExistsArgs
                        .builder()
                        .bucket("test")
                        .build()
        );

        if (isExist) {
            System.out.println("Bucket [test] already exists.");
        } else {
            minioClient.makeBucket(
                    MakeBucketArgs.builder()
                            .bucket("test")
                            .build()
            );
        }

        File file = new File("D:\\tmp\\abc.txt");
        long length = file.length();
        FileInputStream in = new FileInputStream(file);

        minioClient.putObject(
                PutObjectArgs.builder()
                        .bucket("test")
                        .object("abc.txt")
                        .stream(in, length, 5 * 1024 * 1024)
                        .build()
        );
        System.out.println("===");

        try (
                InputStream stream = minioClient.getObject(
                        GetObjectArgs.builder()
                                .bucket("test")
                                .object("abc.txt")
                                .build()
                );
                InputStreamReader reader = new InputStreamReader(stream, StandardCharsets.UTF_8);
                BufferedReader br = new BufferedReader(reader);
        ) {
            // Read the stream
            br.lines().forEach(
                    item ->
                            System.out.println(item)
            );
        }
    }
}
```

## Reference

- [Introduction to MinIO](https://www.baeldung.com/minio)
