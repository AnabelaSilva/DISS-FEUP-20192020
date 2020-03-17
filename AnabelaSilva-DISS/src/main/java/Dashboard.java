import static spark.Spark.*;

public class Dashboard {
    public static void main(String[] args) {
        get("/hello", (req, res) -> "Hello World");
    }
}
