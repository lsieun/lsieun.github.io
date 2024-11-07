---
title: "Spring Boot"
sequence: "104"
---

## Spring Boot 项目

### 新建 Spring Boot 项目

第 1 步，选择 Spring Initializr，并填写相应信息：

![](/assets/images/prometheus/spring-boot/spring-boot-001.png)

第 2 步，勾选相应的内容：

- Spring Boot: 2.7.16
  - Spring Web
  - Spring Boot Actuator

![](/assets/images/prometheus/spring-boot/spring-boot-002.png)

![](/assets/images/prometheus/spring-boot/spring-boot-003.png)

第 3 步，观察 `pom.xml` 文件，有三个依赖项：

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-actuator</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>

    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>
```

第 4 步，将主类修改为 `PrometheusApplication`

```java
package lsieun.prometheus;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class PrometheusApplication {

	public static void main(String[] args) {
		SpringApplication.run(PrometheusApplication.class, args);
	}

}
```

第 5 步，配置 `application.yml` 文件：

```yaml
spring:
  application:
    name: springboot-prometheus

management:
  endpoints:
    web:
      exposure:
        include: "*"

server:
  port: 8888
```

第 6 步，启动 `PrometheusApplication`。


第 7 步，访问浏览器：

```text
http://192.168.80.1:8888/actuator
```

返回结果：

```text
{
  "_links": {
    "self": {
      "href": "http://192.168.80.1:8888/actuator",
      "templated": false
    },
    "beans": {
      "href": "http://192.168.80.1:8888/actuator/beans",
      "templated": false
    },
    ....
  }
}
```

### 转换为 Prometheus 的格式

第 1 步，在 `pom.xml` 文件中，添加依赖：

```xml
<dependency>
    <groupId>io.micrometer</groupId>
    <artifactId>micrometer-registry-prometheus</artifactId>
    <scope>runtime</scope>
</dependency>
```

第 2 步，在 `application.yml` 文件中，添加配置：

```yaml
spring:
  application:
    name: springboot-prometheus

management:
  endpoints:
    web:
      exposure:
        include: "*"
  endpoint:                   # A
    prometheus:               # A
      enabled: true           # A
    health:                   # A
      show-details: always    # A
  metrics:                    # B
    export:                   # B
      prometheus:             # B
        enabled: true         # B

server:
  port: 8888
```

第 3 步，启动 `PrometheusApplication`。

第 4 步，访问地址：

```text
http://192.168.80.1:8888/actuator
```

在返回的结果中，可以看到多了 `prometheus` 的地址：

```text
{
  "_links": {
    "self": {
      "href": "http://192.168.80.1:8888/actuator",
      "templated": false
    },
    "beans": {
      "href": "http://192.168.80.1:8888/actuator/beans",
      "templated": false
    },
    ......
    "prometheus": {                                               # A.
      "href": "http://192.168.80.1:8888/actuator/prometheus",    # A.
      "templated": false                                          # A.
    },
    "metrics": {
      "href": "http://192.168.80.1:8888/actuator/metrics",
      "templated": false
    }
  }
}
```

第 5 步，访问地址：

```text
http://192.168.80.1:8888/actuator/prometheus
```

![](/assets/images/prometheus/spring-boot/spring-boot-004-actuator-prometheus.png)

### 添加应用的名称信息

第 1 步，添加一个 Bean：

```java
package lsieun.prometheus;

import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.actuate.autoconfigure.metrics.MeterRegistryCustomizer;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class PrometheusApplication {

    public static void main(String[] args) {
        SpringApplication.run(PrometheusApplication.class, args);
    }

    @Bean
    MeterRegistryCustomizer<MeterRegistry> configurer(
            @Value("${spring.application.name}") String applicationName
    ) {
        return (registry) -> registry.config().commonTags("application", applicationName);
    }

}
```

第 2 步，访问地址：

```text
http://192.168.80.1:8888/actuator/prometheus
```

![](/assets/images/prometheus/spring-boot/spring-boot-005-actuator-prometheus.png)

第 3 步，再次修改：

```java
package lsieun.prometheus;

import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.actuate.autoconfigure.metrics.MeterRegistryCustomizer;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class PrometheusApplication {

    public static void main(String[] args) {
        SpringApplication.run(PrometheusApplication.class, args);
    }

    @Bean
    MeterRegistryCustomizer<MeterRegistry> configurer(
            @Value("${spring.application.name}") String applicationName
    ) {
        return (registry) -> registry.config().commonTags("application", applicationName, "author", "lsieun");
    }

}
```

第 4 步，查看修改后的效果：

![](/assets/images/prometheus/spring-boot/spring-boot-006-actuator-prometheus.png)

## Prometheus 配置

第 1 步，准备镜像文件

```text
$ docker pull prom/prometheus:v2.45.0
$ docker pull grafana/grafana
```

第 2 步，创建文件目录：

```text
$ sudo mkdir -p /opt/prometheus
$ sudo touch /opt/prometheus/prometheus.yml
$ sudo chmod -R 755 /opt/prometheus/
```

第 3 步，编辑配置文件：

```text
$ sudo vi /opt/prometheus/prometheus.yml
```

```yaml
scrape_configs:
  - job_name: "springboot_prometheus"
    scrape_interval: 5s
    metrics_path: '/actuator/prometheu
    static_configs:
      - targets: ["192.168.80.1:8888"]
```

prometheus.yml

```yaml
# my global config
global:
  scrape_interval: 15s # Set the scrape interval to every 15 seconds. Default is every 1 minute.
  evaluation_interval: 15s # Evaluate rules every 15 seconds. The default is every 1 minute.
  # scrape_timeout is set to the global default (10s).

# Alertmanager configuration
alerting:
  alertmanagers:
    - static_configs:
        - targets:
          # - alertmanager:9093

# Load rules once and periodically evaluate them according to the global 'evaluation_interval'.
rule_files:
  # - "first_rules.yml"
  # - "second_rules.yml"

# A scrape configuration containing exactly one endpoint to scrape:
# Here it's Prometheus itself.
scrape_configs:
  # The job name is added as a label `job=<job_name>` to any timeseries scraped from this config.
  - job_name: "prometheus"

    # metrics_path defaults to '/metrics'
    # scheme defaults to 'http'.

    static_configs:
      - targets: ["localhost:9090"]

  - job_name: "springboot_prometheus"
    scrape_interval: 5s
    metrics_path: '/actuator/prometheus'
    static_configs:
      - targets: ["192.168.80.1:8888"]
```

第 4 步，创建 macvlan：

```text
$ docker network create --driver macvlan \
  --subnet=192.168.80.0/24 \
  --ip-range=192.168.80.0/24 \
  --gateway=192.168.80.2 \
  -o parent=ens32 \
  macvlan80
```

第 5 步，启动 Prometheus：

```text
$ docker run -d --name=prometheus \
  -v /opt/prometheus/prometheus.yml:/etc/prometheus/prometheus.yml \
  --ip=192.168.80.250 \
  --network macvlan80 \
  prom/prometheus:v2.45.0
```

第 6 步，访问地址：

```text
http://192.168.80.250:9090/targets
```

![](/assets/images/prometheus/spring-boot/prometheus-001-targets.png)

## Grafana

### 启动 Grafana

```text
$ docker run -d --name=grafana --ip=192.168.80.251 --network macvlan80 grafana/grafana
```

```text
http://192.168.80.251:3000/
```

- 用户：`admin`
- 密码：`admin`

### 配置数据源

第 1 步，在 Configuration 下选择 Data sources：

![](/assets/images/prometheus/spring-boot/grafana-002-configuration-data-source.png)

第 2 步，选择 Add data source：

![](/assets/images/prometheus/spring-boot/grafana-003-add-data-source.png)

第 3 步，选择 Prometheus：

![](/assets/images/prometheus/spring-boot/grafana-004-select-data-source.png)

第 4 步，输入 URL 地址：

![](/assets/images/prometheus/spring-boot/grafana-005-data-source-url.png)

第 5 步，选择 `Save & test` 按钮：

![](/assets/images/prometheus/spring-boot/grafana-006-save-and-test.png)

### 添加 DashBoard

第 1 步，选择 Create 下的 Import 按钮：

![](/assets/images/prometheus/spring-boot/grafana-007-import.png)

第 2 步，输入 `4701`，然后点击 Load 按钮：

![](/assets/images/prometheus/spring-boot/grafana-008-load-dashboard-4701.png)

第 3 步，选择数据源，并点击 Import：

![](/assets/images/prometheus/spring-boot/grafana-009-import-dashboard-4701.png)

第 4 步，查看到 Dashboard 界面：

![](/assets/images/prometheus/spring-boot/grafana-010-dashboard-view.png)
