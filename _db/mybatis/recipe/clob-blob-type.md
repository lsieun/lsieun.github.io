---
title: "Handling the CLOB/BLOB types"
sequence: "101"
---

MyBatis provides built-in support for mapping `CLOB`/`BLOB` type columns.



```mysql
CREATE TABLE USER_PICS
(
    ID   INT(11) NOT NULL AUTO_INCREMENT,
    NAME VARCHAR(50) DEFAULT NULL,
    PIC  BLOB,
    BIO  LONGTEXT,
    PRIMARY KEY (ID)
) AUTO_INCREMENT = 1;
```

```java
public class UserPic {
    private int id;
    private String name;
    private byte[] pic;
    private String bio;

    public UserPic() {
    }

    public UserPic(int id, String name, byte[] pic, String bio) {
        this.id = id;
        this.name = name;
        this.pic = pic;
        this.bio = bio;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public byte[] getPic() {
        return pic;
    }

    public void setPic(byte[] pic) {
        this.pic = pic;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }
}
```

```java
import org.apache.ibatis.annotations.Param;

public interface UserPicMapper {
    int insertUserPic(UserPic entity);

    UserPic getUserPic(@Param("id") int id);
}
```

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="lsieun.batis.mapper.UserPicMapper">
    <insert id="insertUserPic">
        insert into USER_PICS(NAME, PIC, BIO)
        values (#{name}, #{pic}, #{bio});
    </insert>
    <select id="getUserPic" parameterType="int" resultType="userPic">
        select * from USER_PICS WHERE ID = #{id}
    </select>
</mapper>
```

```java
import org.apache.ibatis.session.SqlSession;
import org.junit.jupiter.api.Test;

import java.io.*;

class UserPicMapperTest {
    @Test
    void testInsertUserPic() {
        byte[] pic = null;
        try {
            File file = new File("D:\\workspace\\git-repo\\learn-java-mybatis\\src\\main\\resources\\images\\BehatiPrinsloo-Angel.webp");
            InputStream is = new FileInputStream(file);
            pic = new byte[is.available()];
            is.read(pic);
            is.close();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        String name = "UserName";
        String bio = "put some lengthy bio here";
        UserPic userPic = new UserPic(0, name, pic, bio);
        SqlSession sqlSession = MyBatisSqlSessionFactory.openSession();
        try {
            UserPicMapper mapper = sqlSession.getMapper(UserPicMapper.class);
            mapper.insertUserPic(userPic);
            sqlSession.commit();
        } finally {
            sqlSession.close();
        }
    }

    @Test
    void testGetUserPic() {
        SqlSession sqlSession = MyBatisSqlSessionFactory.openSession();

        UserPic userPic = null;
        try {
            UserPicMapper mapper = sqlSession.getMapper(UserPicMapper.class);
            userPic = mapper.getUserPic(1);
        } finally {
            sqlSession.close();
        }

        if (userPic == null) {
            return;
        }

        byte[] pic = userPic.getPic();
        String bio = userPic.getBio();
        System.out.println(bio);
        FileUtils.writeBytes("D:\\workspace\\git-repo\\learn-java-mybatis\\target\\my.webp", pic);

    }
}
```

