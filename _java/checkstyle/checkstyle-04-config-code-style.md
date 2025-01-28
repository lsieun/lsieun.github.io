---
title: "Checkstyle配置：Code Style"
sequence: "104"
---


## 空格

```xml
<!DOCTYPE module PUBLIC
        "-//Checkstyle//DTD Checkstyle Configuration 1.3//EN"
        "https://checkstyle.org/dtds/configuration_1_3.dtd">
<module name="Checker">
    <module name="TreeWalker">
        <!-- ****************************空格限定***************************** -->
        <!-- 检查约定方法名与左边圆括号之间不许出现空格
            public void wrongStyleMethod (){
            public void wrongStyleMethod
                                        (String para1, String para2){
            都是不能通过的，只允许方法名后紧跟左边圆括号"("-->
        <module name="MethodParamPad"/>

        <!-- 不允许左圆括号右边有空格，也不允许与右圆括号左边有空格
            public void wrongStyleMethod( String para1, String para2 ){
            public void correctStyleMethod(String para1, String para2){
            都不能通过-->
        <module name="ParenPad"/>

        <!-- 在类型转换时，不允许左圆括号右边有空格，也不允许与右圆括号左边有空格
            Object myObject = ( Object )other;
            不能通过-->
        <module name="TypecastParenPad"/>

        <!-- 检查在某个特定关键字之后应保留空格 -->
        <module name="NoWhitespaceAfter"/>
        <!-- 检查在某个特定关键字之前应保留空格 -->
        <module name="NoWhitespaceBefore"/>
        <!-- 检查分隔符是否在空白之后 -->
        <module name="WhitespaceAfter"/>
        <!-- 检查分隔符周围是否有空白 -->
        <module name="WhitespaceAround"/>
    </module>
</module>
```

## 换行

```xml
<!DOCTYPE module PUBLIC
        "-//Checkstyle//DTD Checkstyle Configuration 1.3//EN"
        "https://checkstyle.org/dtds/configuration_1_3.dtd">
<module name="Checker">
    <module name="TreeWalker">
        <!-- 操作符换行策略检查 -->
        <module name="OperatorWrap"/>
    </module>
</module>
```

## 括号

```xml
<!DOCTYPE module PUBLIC
        "-//Checkstyle//DTD Checkstyle Configuration 1.3//EN"
        "https://checkstyle.org/dtds/configuration_1_3.dtd">
<module name="Checker">
    <module name="TreeWalker">
        <!-- 所有区域都要使用大括号 if(true)System.out.println("if 嵌套浓度限定");不能通过-->
        <module name="NeedBraces"/>
        <!-- 多余的括号 -->
        <module name="AvoidNestedBlocks">
            <property name="allowInSwitchCase" value="true"/>
        </module>
        <!-- 检查左大括号位置 -->
        <module name="LeftCurly"/>
        <!-- 检查右大括号位置 -->
        <module name="RightCurly"/>
    </module>
</module>
```

## Block Checks

### EmptyBlock

```xml
<!DOCTYPE module PUBLIC
        "-//Checkstyle//DTD Checkstyle Configuration 1.3//EN"
        "https://checkstyle.org/dtds/configuration_1_3.dtd">
<module name="Checker">
    <module name="TreeWalker">
        <!-- Block Checks -->
        <module name="EmptyBlock">
            <property name="tokens" value="LITERAL_TRY"/>
            <property name="tokens" value="LITERAL_CATCH"/>
            <property name="tokens" value="LITERAL_FINALLY"/>

            <property name="tokens" value="LITERAL_SWITCH"/>
            <property name="tokens" value="LITERAL_CASE"/>
            <property name="tokens" value="LITERAL_DEFAULT"/>

            <property name="tokens" value="LITERAL_IF"/>
            <property name="tokens" value="LITERAL_ELSE"/>

            <property name="tokens" value="LITERAL_FOR"/>
            <property name="tokens" value="LITERAL_DO"/>
            <property name="tokens" value="LITERAL_WHILE"/>

            <property name="tokens" value="STATIC_INIT"/>
            <property name="tokens" value="INSTANCE_INIT"/>
            <property name="tokens" value="ARRAY_INIT"/>

            <property name="tokens" value="LITERAL_SYNCHRONIZED"/>

            <property name="option" value="text"/>
        </module>
    </module>
</module>
```
