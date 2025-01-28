---
title: "File Download: Hiding A Resource"
sequence: "112"
---

In this application we employ a `FileDownloadServlet` servlet to send a `secret.pdf` file to the browser.
However, only authorized users can view it.
If a user has not logged in, the application will forward to the Login page.
Here the user can enter a user name and password in a form that will be submitted to another servlet, `LoginServlet`.

Note that the `secret.pdf` file is placed under `WEB-INF/data` so that direct access is not possible.

The `FileDownloadServlet` class presents the servlet responsible for sending the `secret.pdf` file.
Access is only granted if the user's `HttpSession` contains a `loggedIn` attribute,
which indicates the user has successfully logged in.

```java
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.*;
import java.io.*;

@WebServlet(urlPatterns = { "/download" })
public class FileDownloadServlet extends HttpServlet {
    private static final long serialVersionUID = 7583L;

    public void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        HttpSession session = request.getSession();
        if (session == null || session.getAttribute("loggedIn") == null) {
            RequestDispatcher dispatcher = request.getRequestDispatcher("/login.jsp");
            dispatcher.forward(request, response);
            // must return after dispatcher.forward(). Otherwise,
            // the code below will be executed
            return;
        }

        String dataDirectory = request.getServletContext().getRealPath("/WEB-INF/data");
        File file = new File(dataDirectory, "secret.pdf");
        if (file.exists()) {
            response.setContentType("application/pdf");
            response.addHeader("Content-Disposition", "attachment; filename=secret.pdf");
            byte[] buffer = new byte[1024];

            try (
                    FileInputStream fis = new FileInputStream(file);
                    BufferedInputStream bis = new BufferedInputStream(fis)
            ) {
                OutputStream os = response.getOutputStream();
                int i = bis.read(buffer);
                while (i != -1) {
                    os.write(buffer, 0, i);
                    i = bis.read(buffer);
                }
            } catch (IOException ex) {
                System.out.println(ex);
            }
        }
    }
}
```

Note that calling `forward` on a `RequestDispatcher` will forward control to a different resource.
However, it does not stop the code execution of the calling object.
As such, you have to return after forwarding.

```java
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

@WebServlet(urlPatterns = {"/login"})
public class LoginServlet extends HttpServlet {
    private static final long serialVersionUID = -920L;

    public void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String userName = request.getParameter("userName");
        String password = request.getParameter("password");
        if (
                userName != null && userName.equals("ken")
                && password != null && password.equals("secret")
        ) {
            HttpSession session = request.getSession(true);
            session.setAttribute("loggedIn", Boolean.TRUE);
            response.sendRedirect("download");
            // must call return or else the code after this if
            // block, if any, will be executed
            return;
        } else {
            RequestDispatcher dispatcher =
                    request.getRequestDispatcher("/login.jsp");
            dispatcher.forward(request, response);
        }
    }
}
```
