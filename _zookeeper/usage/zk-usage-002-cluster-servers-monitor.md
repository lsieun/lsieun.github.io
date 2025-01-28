---
title: "服务器动态上下线监听"
sequence: "102"
---

## 代码

### Const

```java
public class Const {
    public static final String ROOT_PATH = "/clusterServers";

    public static final String CONNECT_STRING = "192.168.80.131:2181,192.168.80.132:2181,192.168.80.133:2181";
}
```

### Server

```java
import org.I0Itec.zkclient.ZkClient;

import static lsieun.zk.c2.monitor.Const.CONNECT_STRING;
import static lsieun.zk.c2.monitor.Const.ROOT_PATH;

public class Server {
    private final String serverString;
    private ZkClient zkClient;

    public Server(String serverString) {
        this.serverString = serverString;
    }

    private void connect() {
        // 第 1 步，创建 Client
        zkClient = new ZkClient(serverString);

        // 第 2 步，操作
        boolean exists = zkClient.exists(ROOT_PATH);
        if (!exists) {
            zkClient.createPersistent(ROOT_PATH, true);
        }
    }

    private void saveServerInfo(String ip, int port) {
//        String path = String.format("%s/%s:%d", ROOT_PATH, ip, port);
//        zkClient.createEphemeral(path);

        String path = String.format("%s/server", ROOT_PATH);
        String sequencePath = zkClient.createEphemeralSequential(path, ip + ":" + port);

        String msg = String.format("Path: %s, Data: %s:%d", sequencePath, ip, port);
        System.out.println(msg);
    }

    private void close() {
        zkClient.close();
    }


    public static void main(String[] args) throws Exception {
        String ip = args[0];
        int port = Integer.parseInt(args[1]);

        Server server = new Server(CONNECT_STRING);
        server.connect();
        server.saveServerInfo(ip, port);

        Thread t = new TimeService(port);
        t.setDaemon(true);
        t.start();

        Thread.sleep(600_000);

        server.close();
    }
}
```

### TimeService

```java
import java.io.IOException;
import java.io.OutputStream;
import java.net.ServerSocket;
import java.net.Socket;
import java.nio.charset.StandardCharsets;
import java.util.Date;

public class TimeService extends Thread {
    private final int port;

    public TimeService(int port) {
        this.port = port;
    }

    @Override
    public void run() {
        try (
                ServerSocket serverSocket = new ServerSocket(port);
        ) {
            while (true) {
                try (
                        Socket socket = serverSocket.accept();
                        OutputStream outputStream = socket.getOutputStream();
                ) {
                    byte[] bytes = new Date().toString().getBytes(StandardCharsets.UTF_8);
                    outputStream.write(bytes);
                }
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
```

### Client

```java
import org.I0Itec.zkclient.IZkChildListener;
import org.I0Itec.zkclient.ZkClient;

import java.io.InputStream;
import java.io.OutputStream;
import java.net.Socket;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

public class Client {

    private final String connectString;
    private ZkClient zkClient;

    private List<String> serverList = new ArrayList<>();

    public Client(String connectString) {
        this.connectString = connectString;
    }

    private void connect() {
        // 第 1 步，创建 Client
        zkClient = new ZkClient(connectString);

        // 第 2 步，操作
        List<String> children = zkClient.getChildren(ROOT_PATH);
        List<String> list = new ArrayList<>();
        for (String child : children) {
            String path = ROOT_PATH + "/" + child;
            // data = "ip:port"
            Object data = zkClient.readData(path);
            list.add(String.valueOf(data));
        }

        serverList = list;
        System.out.println("[CONNECT] " + serverList);

        // 第 3 步，对目录进行监听
        zkClient.subscribeChildChanges(ROOT_PATH, new IZkChildListener() {
            @Override
            public void handleChildChange(String parentPath, List<String> currentChilds) throws Exception {
                System.out.println("[ChildChange] parentPath = " + parentPath + ", currentChilds = " + currentChilds);
                List<String> list = new ArrayList<>();
                for (String child : currentChilds) {
                    // data = "ip:port"
                    Object data = zkClient.readData(ROOT_PATH + "/" + child);
                    list.add(String.valueOf(data));
                }

                serverList = list;

                System.out.println("[ChildChange] " + serverList);
            }
        });
    }

    private void close() {
        zkClient.close();
    }

    public void sendRequest() {
        // 第 1 步，目标服务器地址
        System.out.println("[Server List]  " + serverList);

        // 第 2 步，随机选择一个服务器
        Random rand = new Random();
        int index = rand.nextInt(serverList.size());
        String ipAndPort = serverList.get(index);
        System.out.println("[IP:Port] " + ipAndPort);

        String[] array = ipAndPort.split(":");
        String ip = array[0];
        int port = Integer.parseInt(array[1]);


        // 第 3 步，建立 Socket 连接
        try (
                Socket socket = new Socket(ip, port);
                InputStream in = socket.getInputStream();
                OutputStream out = socket.getOutputStream();
        ) {
            // 发送数据
            out.write("query time".getBytes(StandardCharsets.UTF_8));
            out.flush();

            Thread.sleep(1000);

            int available = in.available();
            if (available > 0) {
                // 接收数据
                byte[] buffer = new byte[1024];

                int length;
                while ((length = in.read(buffer)) != -1) {
                    String str = new String(buffer, 0, length);
                    String info = String.format("[%s:%d] %s", ip, port, str);
                    System.out.println(info);
                }
            }


        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }

    public static void main(String[] args) throws Exception {
        Client client = new Client(CONNECT_STRING);
        client.connect();

        for (int i = 0; i < 20; i++) {
            try {
                client.sendRequest();
                Thread.sleep(2000);
            }
            catch (Exception ignored) {}
        }

        client.close();
    }
}
```

