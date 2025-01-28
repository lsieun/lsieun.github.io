---
title: "Quick Start"
sequence: "102"
---

```text
Table (DB) --> Entity (POJO) <-- EntityManager (JPA) <--- EntityManagerFactory (JPA) <-- Persistence (JPA) <-- persistence.xml
```

## SQL

```mysql
# 查看数据库版本（使用 MySQL 8 版本）
select @@version;

# 创建数据库
CREATE DATABASE `lsieun_db`;

# 使用数据库
USE `lsieun_db`;

# 创建数据表
DROP TABLE IF EXISTS `t_student`;
CREATE TABLE `t_student`
(
    `id`           BIGINT       NOT NULL AUTO_INCREMENT COMMENT 'ID',
    `student_name` VARCHAR(255) NOT NULL COMMENT '姓名',
    `birth_date`   DATETIME    DEFAULT NULL COMMENT '出生日期',
    `gender`       VARCHAR(10) DEFAULT NULL COMMENT '性别',
    PRIMARY KEY (`id`)
);
```

## pom.xml

```xml

<dependencies>
    <!-- JPA -->
    <dependency>
        <groupId>jakarta.persistence</groupId>
        <artifactId>jakarta.persistence-api</artifactId>
        <version>3.1.0</version>
    </dependency>

    <!-- ORM: Hibernate -->
    <dependency>
        <groupId>org.hibernate.orm</groupId>
        <artifactId>hibernate-core</artifactId>
        <version>6.2.4.Final</version>
    </dependency>

    <!-- DB: MySQL -->
    <dependency>
        <groupId>com.mysql</groupId>
        <artifactId>mysql-connector-j</artifactId>
        <version>8.0.33</version>
    </dependency>

    <!-- Unit Test -->
    <dependency>
        <groupId>org.junit.jupiter</groupId>
        <artifactId>junit-jupiter</artifactId>
        <version>5.9.3</version>
        <scope>test</scope>
    </dependency>
</dependencies>
```

## Entity

```java
import jakarta.persistence.*;
import lsieun.jpa.common.Gender;

import java.util.Date;

@Entity
@Table(name = "t_student", schema = "lsieun_db")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "student_name", length = 50, nullable = false, unique = false)
    private String name;

    @Transient
    private Integer age;

    @Column(name = "birth_date")
    @Temporal(TemporalType.DATE)
    private Date birthDate;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    public Student() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public Date getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(Date birthDate) {
        this.birthDate = birthDate;
    }

    public Gender getGender() {
        return gender;
    }

    public void setGender(Gender gender) {
        this.gender = gender;
    }

    public void setName(String name) {
        this.name = name;
    }
}
```

```java
public enum Gender {
    MALE, 
    FEMALE
}
```

## JPA 的核心配置文件

在 Maven 工程的 `src/main/resources` 路径下创建一个名为 `META-INF` 的文件夹，在文件夹下创建一个名为 `persistence.xml`
的配置文件。

> 注意：`META-INF` 文件夹名称不能修改，`persistence.xml` 文件名称不能修改。

```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<persistence version="3.0" xmlns="https://jakarta.ee/xml/ns/persistence"
             xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
             xsi:schemaLocation="https://jakarta.ee/xml/ns/persistence
             https://jakarta.ee/xml/ns/persistence/persistence_3_0.xsd">

    <!-- 持久化单元 -->
    <persistence-unit name="jpa-hibernate-mysql" transaction-type="RESOURCE_LOCAL">
        <!-- 配置 JPA 规范的服务提供商 -->
        <provider>org.hibernate.jpa.HibernatePersistenceProvider</provider>
        <properties>
            <!-- 数据库驱动 -->
            <property name="jakarta.persistence.jdbc.driver" value="com.mysql.cj.jdbc.Driver"/>
            <!-- 数据库地址 -->
            <property name="jakarta.persistence.jdbc.url" value="jdbc:mysql://localhost:3306/lsieun_db"/>
            <!-- 数据库用户 -->
            <property name="jakarta.persistence.jdbc.user" value="root"/>
            <!-- 数据库密码 -->
            <property name="jakarta.persistence.jdbc.password" value="123456"/>
            <!--<property name="jakarta.persistence.schema-generation.database.action" value="create"/>-->

            <!-- JPA 的核心配置中兼容 Hibernate 的配置 -->
            <property name="hibernate.dialect" value="org.hibernate.dialect.MySQLDialect"/>
            <property name="hibernate.show_sql" value="true"/>
            <property name="hibernate.format_sql" value="true"/>
            <property name="hibernate.hbm2ddl.auto" value="update"/>
        </properties>
    </persistence-unit>

    <!-- 持久化单元 -->
    <persistence-unit name="jpa-eclipselink-mysql" transaction-type="RESOURCE_LOCAL">
        <!-- 配置 JPA 规范的服务提供商 -->
        <provider>org.eclipse.persistence.jpa.PersistenceProvider</provider>
        <class>lsieun.jpa.entity.Student</class>
        <properties>
            <!-- 数据库驱动 -->
            <property name="jakarta.persistence.jdbc.driver" value="com.mysql.cj.jdbc.Driver"/>
            <!-- 数据库地址 -->
            <property name="jakarta.persistence.jdbc.url" value="jdbc:mysql://localhost:3306/lsieun_db"/>
            <!-- 数据库用户 -->
            <property name="jakarta.persistence.jdbc.user" value="root"/>
            <!-- 数据库密码 -->
            <property name="jakarta.persistence.jdbc.password" value="123456"/>
            <property name="jakarta.persistence.schema-generation.database.action" value="create"/>
        </properties>
    </persistence-unit>
</persistence>
```

```text
<persistence-unit name="jpa-hibernate-mysql" transaction-type="RESOURCE_LOCAL">
```

在 `<persistence-unit>` 元素中，

- `name`：持久化单元的名称，唯一
- `transaction-type`：事务类型
    - `RESOURCE_LOCAL`：本地事务
    - `JTA`：分布式事务

```java
package jakarta.persistence.spi;

public enum PersistenceUnitTransactionType {

  /** JTA entity managers will be created. */
  JTA,

  /** Resource-local entity managers will be created. */
  RESOURCE_LOCAL
}
```

`JTA` (**Java Transaction API**) 是在 Java 程序中实现分布式事务的 API，
它在 Java 应用程序的中处理事务、协调资源管理器访问和参与类型的事务，
该 API 的实现能够提供 ACID （原子性、一致性、独立性和持久性）特性，用于保障事务的完整性和可靠性。

```text
<provider>org.hibernate.jpa.HibernatePersistenceProvider</provider>
```

```java
package org.hibernate.jpa;

public class HibernatePersistenceProvider implements PersistenceProvider {
    // ...
}
```

```java
package jakarta.persistence.spi;

public interface PersistenceProvider {
    
}
```

这里用了 `SPI` 的技术：

![](/assets/images/java/jpa/hibernate-core-persistence-provider.png)


在 `hibernate-core-x.x.x.jar` 中的 `org.hibernate.cfg.AvailableSettings` 类定义了 `<property>` 元素的 `name` 属性：

![](/assets/images/java/jpa/hibernate-core-jar-cfg-available-settings.png)

## Test

```java
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.EntityTransaction;
import jakarta.persistence.Persistence;
import lsieun.jpa.common.Gender;
import lsieun.jpa.entity.Student;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

import java.util.Date;

@TestMethodOrder(value = MethodOrderer.OrderAnnotation.class)
public class JpaTest {
    private final String persistenceUnitName = "jpa-hibernate-mysql";

    @Test
    @Order(1)
    void testSave() {
        // 第 0 步，准备 Entity
        Student entity = new Student();
        entity.setName("李小红");
        entity.setBirthDate(new Date());
        entity.setGender(Gender.FEMALE);

        // 第 1 步，创建持久化管理器工厂
        EntityManagerFactory factory = Persistence.createEntityManagerFactory(persistenceUnitName);

        // 第 2 步，创建持久化管理器
        // EntityManager 是 JPA 中最重要的 API，我们可以获取 Transaction 以及数据的 CRUD 操作
        EntityManager entityManager = factory.createEntityManager();

        // 第 3 步，获取事务，并开启
        EntityTransaction transaction = entityManager.getTransaction();
        transaction.begin();

        // 第 4 步，操作
        entityManager.persist(entity);

        // 第 5 步，提交事务
        transaction.commit();

        // 第 6 步，关闭资源
        entityManager.close();
        factory.close();
    }

    @Test
    @Order(2)
    void testFind() {
        EntityManagerFactory factory = Persistence.createEntityManagerFactory(persistenceUnitName);
        EntityManager entityManager = factory.createEntityManager();
        EntityTransaction transaction = entityManager.getTransaction();
        transaction.begin();

        // 第 4 步，操作
        Student entity = entityManager.find(Student.class, 1L);
        System.out.println(entity.getName());

        transaction.commit();
        entityManager.close();
        factory.close();
    }

    @Test
    @Order(3)
    void testUpdate() {
        EntityManagerFactory factory = Persistence.createEntityManagerFactory(persistenceUnitName);
        EntityManager entityManager = factory.createEntityManager();
        EntityTransaction transaction = entityManager.getTransaction();
        transaction.begin();

        // 第 4 步，操作：JPA 的修改操作，要求必须先查询，再修改
        Student entity = entityManager.find(Student.class, 1L);
        entity.setName("张小飞");
        entityManager.merge(entity);

        transaction.commit();
        entityManager.close();
        factory.close();
    }

    @Test
    @Order(4)
    void testDelete() {
        EntityManagerFactory factory = Persistence.createEntityManagerFactory(persistenceUnitName);
        EntityManager entityManager = factory.createEntityManager();
        EntityTransaction transaction = entityManager.getTransaction();
        transaction.begin();

        // 第 4 步，操作：JPA 的删除操作，要求必须先查询，再修改
        Student entity = entityManager.find(Student.class, 1L);
        entityManager.remove(entity);

        transaction.commit();
        entityManager.close();
        factory.close();
    }
}
```

## Reference

- [The right MySQL persistence.xml example file for JPA 3 and Hibernate 6](https://www.theserverside.com/blog/Coffee-Talk-Java-News-Stories-and-Opinions/JPA3-MySQL-persistencexml-Spring-example-Hibernate6-Java-JakartaEE)
- [Chapter 4. Tutorial Using the Java Persistence API (JPA)](https://docs.jboss.org/hibernate/orm/3.6/quickstart/en-US/html/hibernate-gsg-tutorial-jpa.html)
