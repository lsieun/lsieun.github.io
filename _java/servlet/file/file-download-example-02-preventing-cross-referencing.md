---
title: "File Download: Preventing Cross-Referencing"
sequence: "113"
---

Competitors might try to “steal” your web assets by cross-referencing them,
i.e. displaying your valuables in their websites as if they were theirs.
You can prevent this from happening by programmatically sending the resources
only if the `referer` header contains your domain name.
Of course the most determined thieves will still be able to download your properties.
However, they can't do that without sweat.

```java
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;

@WebServlet(urlPatterns = {"/getImage"})
public class ImageServlet extends HttpServlet {

    private static final long serialVersionUID = -99L;

    public void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String referrer = request.getHeader("referer");
        if (referrer != null) {
            String imageId = request.getParameter("id");
            String imageDirectory = request.getServletContext().getRealPath("/WEB-INF/image");
            File file = new File(imageDirectory, imageId + ".jpg");
            if (file.exists()) {
                response.setContentType("image/jpg");
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
                    ex.printStackTrace();
                }
            }
        }
    }
}
```

