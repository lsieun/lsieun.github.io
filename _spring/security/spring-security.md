---
title: "Spring Security"
sequence: "111"
---

我之前也接触过“用户、角色、权限”，但是一直没有彻底搞明白，没有形成系统的认识：
有哪些是核心的概念，有哪些需要考虑的因素。



## Spring Security介绍

Spring Security是基于Spring生态圈的，用于提供安全访问控制解决方案的框架。

> 作用

Spring Security的安全管理有两个重要概念：Authentication（认证）和Authorization（授权）。

> 两个重要概念

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
```

Spring Security登录认证主要涉及两个重要的接口：`UserDetailService`和`UserDetails`接口。
`UserDetailService`接口主要定义了一个方法`loadUserByUsername(String username)`用于完成用户信息的查询，
其中`username`就是登录时的登录名称。
登录认证时，需要自定义一个实现类，实现`UserDetailService`接口，完成数据库查询，该接口返回`UserDetails`。

> 编程层面：两个重要接口。

```java
public interface UserDetailsService {

	/**
	 * Locates the user based on the username.
     * In the actual implementation, the search may possibly be case sensitive,
     * or case insensitive depending on how the implementation instance is configured.
     * In this case, the <code>UserDetails</code> object that comes back may have a username
     * that is of a different case than what was actually requested..
	 * @param username the username identifying the user whose data is required.
	 * @return a fully populated user record (never <code>null</code>)
	 * @throws UsernameNotFoundException if the user could not be found or the user has no * GrantedAuthority
	 */
	UserDetails loadUserByUsername(String username) throws UsernameNotFoundException;

}
```

`UserDetails`主要用于封装认证成功时的用户信息，即`UserDetailService`返回的用户信息，可以用Spring自己的`User`对象，
但是最好是实现`UserDetails`接口，自定义用户对象。

```java
public interface UserDetails extends Serializable {

	/**
	 * Returns the authorities granted to the user. Cannot return <code>null</code>.
	 * @return the authorities, sorted by natural key (never <code>null</code>)
	 */
	Collection<? extends GrantedAuthority> getAuthorities();

	/**
	 * Returns the password used to authenticate the user.
	 * @return the password
	 */
	String getPassword();

	/**
	 * Returns the username used to authenticate the user. Cannot return
	 * <code>null</code>.
	 * @return the username (never <code>null</code>)
	 */
	String getUsername();

	/**
	 * Indicates whether the user's account has expired.
     * An expired account cannot be authenticated.
	 * @return <code>true</code> if the user's account is valid (ie non-expired),
	 * <code>false</code> if no longer valid (ie expired)
	 */
	boolean isAccountNonExpired();

	/**
	 * Indicates whether the user is locked or unlocked.
     * A locked user cannot be authenticated.
	 * @return <code>true</code> if the user is not locked, <code>false</code> otherwise
	 */
	boolean isAccountNonLocked();

	/**
	 * Indicates whether the user's credentials (password) has expired.
     * Expired credentials prevent authentication.
	 * @return <code>true</code> if the user's credentials are valid (ie non-expired),
	 * <code>false</code> if no longer valid (ie expired)
	 */
	boolean isCredentialsNonExpired();

	/**
	 * Indicates whether the user is enabled or disabled.
     * A disabled user cannot be authenticated.
	 * @return <code>true</code> if the user is enabled, <code>false</code> otherwise
	 */
	boolean isEnabled();
}
```

## Spring Security

- 自定义`UserDetails`类：当实体对象字段不满足时，需要自定义`UserDetails`，一般都要自定义`UserDetails`。
- 自定义`UserDetailService`类：主要用于从数据库查询用户信息。
- 创建登录认证成功处理器，认证成功需要返回JSON数据，菜单权限等。
- 创建登录认证成功处理器，认证失败需要返回JSON数据，给前端判断。
- 创建匿名用户访问“无权限资源”时处理器，匿名用户访问时，需要提示JSON。
- 创建认证的用户访问“无权限资源”时的处理器，无权限访问时，需要提示JSON。
- 配置Spring Security配置类，把上面自定义的处理器交给Spring Security。


