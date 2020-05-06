import org.junit.jupiter.api.*;
import org.openqa.selenium.Dimension;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import static org.junit.jupiter.api.Assertions.*;


public class GUITests {
    static WebDriver wd;


    @BeforeAll
    public static void setup() throws InterruptedException {
        //download chromedriver from https://chromedriver.chromium.org/downloads
        //replace 2nd arg with path to your chromedriver
        System.setProperty("webdriver.chrome.driver", "C:\\Users\\Ry\\Desktop\\School\\EE461L\\chromedriver.exe");
        wd = new ChromeDriver();
        Thread.sleep(200);

    }

    @BeforeEach
    public void URL() throws InterruptedException {
        wd.get("https://je66yliu.github.io/songtrackr/#/songs/page/1");
        Thread.sleep(3000);
    }


    @AfterAll
    public static void quit(){
        wd.quit();
    }

    @Test
    public void testURL() throws InterruptedException {
        WebElement we = wd.findElement(By.xpath("//*[@id=\"root\"]/div/div[1]/div[2]/div/div[3]/img"));
        we.click();
        Thread.sleep(500);
        assertEquals("https://je66yliu.github.io/songtrackr/#/song/the-box-by-roddy-ricch",wd.getCurrentUrl());

        wd.manage().window().setSize(new Dimension(1440, 1024));
        Thread.sleep(500);
        we = wd.findElement(By.xpath("//*[@id=\"root\"]/div/header/div/div/div/button"));
        we.click();
        Thread.sleep(500);
        we = wd.findElement(By.xpath("//*[@id=\"simple-menu\"]/div[3]/ul/li[1]"));
        we.click();
        assertEquals("https://je66yliu.github.io/songtrackr/#/songs/page/1", wd.getCurrentUrl());
        Thread.sleep(500);

        we = wd.findElement(By.xpath("//*[@id=\"root\"]/div/header/div/div/div/button"));
        we.click();
        Thread.sleep(500);

        we = wd.findElement(By.xpath("//*[@id=\"simple-menu\"]/div[3]/ul/li[2]"));
        we.click();
        assertEquals("https://je66yliu.github.io/songtrackr/#/artists/page/1", wd.getCurrentUrl());
        Thread.sleep(500);

        we = wd.findElement(By.xpath("//*[@id=\"root\"]/div/header/div/div/div/button"));
        we.click();
        Thread.sleep(500);

        we = wd.findElement(By.xpath("//*[@id=\"simple-menu\"]/div[3]/ul/li[3]"));
        we.click();
        assertEquals("https://je66yliu.github.io/songtrackr/#/charts/page/1", wd.getCurrentUrl());
        Thread.sleep(500);


        we = wd.findElement(By.xpath("//*[@id=\"root\"]/div/header/div/div/button"));
        we.click();
        assertEquals("https://je66yliu.github.io/songtrackr/#/about", wd.getCurrentUrl());
        Thread.sleep(500);
    }


    @Test
    public void testNext() throws InterruptedException {
        WebElement we = wd.findElement(By.xpath("//*[@id=\"root\"]/div/div[1]/div[2]/nav[1]/ul/li[9]/button"));
        for(int i = 2; i< 15; i++) {
            we.click();
            assertEquals("https://je66yliu.github.io/songtrackr/#/songs/page/"+i, wd.getCurrentUrl());
            Thread.sleep(200);
        }
    }

    @Test
    public void testSortedName() throws InterruptedException {
        WebElement we = wd.findElement(By.xpath("//*[@id=\"sort-dropdown\"]"));
        we.click();
        we = wd.findElement(By.xpath("//*[@id=\"root\"]/div/div[1]/div[1]/div[2]/div/div/button[1]"));
        we.click();
        we = wd.findElement(By.xpath("//*[@id=\"root\"]/div/div[1]/div[2]/nav[1]/ul/li[9]/button"));
        WebElement curr;
        WebElement prev;
        for(int j = 0;j<30;j++){
            for(int i =2;i<=9;i++){
                curr = wd.findElement(By.xpath("//*[@id=\"root\"]/div/div[1]/div[2]/div/div["+i+"]/dl/dd[1]"));
                prev = wd.findElement(By.xpath("//*[@id=\"root\"]/div/div[1]/div[2]/div/div["+(i-1)+"]/dl/dd[1]"));
                String s1 = curr.getText().toLowerCase();
                String s2 = prev.getText().toLowerCase();
                assertTrue(s1.compareTo(s2)>=0);
            }
            we.click();
        }

    }


  @Test
  public void testSearchNoResults() throws InterruptedException {
    WebElement we = wd.findElement(By.xpath("//*[@id=\"outlined-basic\"]"));
    we.sendKeys("vndkvnfjsbkbvjkenvkjnr");
    we = wd.findElement(By.xpath("//*[@id=\"root\"]/div/div[1]/h4"));
    assertEquals("Your search 'vndkvnfjsbkbvjkenvkjnr' did not match any songs.", we.getText());
  }

  @Test
  public void testSearchOneResult() throws InterruptedException {
    WebElement we = wd.findElement(By.xpath("//*[@id=\"outlined-basic\"]"));
    we.sendKeys("7 Rings");
    we = wd.findElement(By.xpath("//*[@id=\"root\"]/div/div[1]/div[2]/div/div/dl/dd[1]"));
    assertEquals(we.getText(), "7 Rings");
    we = wd.findElement(By.xpath("//*[@id=\"root\"]/div/div[1]/div[2]/div/div/dl/dd[2]"));
    assertEquals(we.getText(), "Ariana Grande");
    we = wd.findElement(By.xpath("//*[@id=\"root\"]/div/div[1]/div[2]/div/div/dl/dd[3]"));
    assertEquals("thank u, next", we.getText());
  }

  @Test
  public void testSearchMultResults() throws InterruptedException {
    WebElement we = wd.findElement(By.xpath("//*[@id=\"outlined-basic\"]"));
    we.sendKeys("Zedd");
    we = wd.findElement(By.xpath("//*[@id=\"root\"]/div/div[1]/div[2]/div/div/dl/dd[1]"));
    assertEquals("365", we.getText());
    we = wd.findElement(By.xpath("//*[@id=\"root\"]/div/div[1]/div[2]/div/div[2]/dl/dd[1]"));
    assertEquals("Lost in Japan", we.getText());
    we = wd.findElement(By.xpath("//*[@id=\"root\"]/div/div[1]/div[2]/div/div[3]/dl/dd[1]"));
    assertEquals("The Middle", we.getText());
    we = wd.findElement(By.xpath("//*[@id=\"root\"]/div/div[1]/div[2]/div/div[4]/dl/dd[1]"));
    assertEquals("Happy Now", we.getText());
  }

  @Test
  public void testFilter() throws InterruptedException {
    WebElement we = wd.findElement(By.xpath("//*[@id=\"filter-key\"]"));
    we.click();
    we = wd.findElement(By.xpath("//*[@id=\"root\"]/div/div[1]/div[1]/div[3]/div/div/button[12]"));
    we.click();
    we = wd.findElement(By.xpath("//*[@id=\"root\"]/div/div[1]/div[1]/div[4]"));
    assertEquals("Currently Filtering by: D#", we.getText());
    we = wd.findElement(By.xpath("//*[@id=\"root\"]/div/div[1]/div[2]/div/div/dl/dd[1]"));
    assertEquals("Before You Go", we.getText());
    we = wd.findElement(By.xpath("//*[@id=\"root\"]/div/div[1]/div[2]/div/div[2]/dl/dd[1]"));
    assertEquals("Bad Bad", we.getText());
    we = wd.findElement(By.xpath("//*[@id=\"root\"]/div/div[1]/div[2]/div/div[3]/dl/dd[1]"));
    assertEquals("Slow Dancing in the Dark", we.getText());
    we = wd.findElement(By.xpath("//*[@id=\"root\"]/div/div[1]/div[2]/div/div[4]/dl/dd[1]"));
    assertEquals("Christmas (Baby Please Come Home)", we.getText());
  }

  @Test
  public void testFilterTwo() throws InterruptedException {
    WebElement we = wd.findElement(By.xpath("//*[@id=\"filter-key\"]"));
    we.click();
    we = wd.findElement(By.xpath("//*[@id=\"root\"]/div/div[1]/div[1]/div[3]/div/div/button[12]"));
    we.click();
    we = wd.findElement(By.xpath("//*[@id=\"filter-key\"]"));
    we.click();
    we = wd.findElement(By.xpath("//*[@id=\"root\"]/div/div[1]/div[1]/div[3]/div/div/button[8]"));
    we.click();
    we = wd.findElement(By.xpath("//*[@id=\"root\"]/div/div[1]/div[1]/div[4]"));
    assertEquals("Currently Filtering by: D# F#", we.getText());
    we = wd.findElement(By.xpath("//*[@id=\"root\"]/div/div[1]/div[2]/div/div/dl/dd[1]"));
    assertEquals("everything i wanted", we.getText());
    we = wd.findElement(By.xpath("//*[@id=\"root\"]/div/div[1]/div[2]/div/div[2]/dl/dd[1]"));
    assertEquals("Roxanne", we.getText());
    we = wd.findElement(By.xpath("//*[@id=\"root\"]/div/div[1]/div[2]/div/div[3]/dl/dd[1]"));
    assertEquals("Hot Girl Bummer", we.getText());
    we = wd.findElement(By.xpath("//*[@id=\"root\"]/div/div[1]/div[2]/div/div[4]/dl/dd[1]"));
    assertEquals("I Hope", we.getText());
  }

    @Test
    public void testSortedArtist() throws InterruptedException {
        WebElement we = wd.findElement(By.xpath("//*[@id=\"sort-dropdown\"]"));
        we.click();
        we = wd.findElement(By.xpath("//*[@id=\"root\"]/div/div[1]/div[1]/div[2]/div/div/button[2]"));
        we.click();

        we = wd.findElement(By.xpath("//*[@id=\"root\"]/div/div[1]/div[2]/nav[1]/ul/li[9]/button"));
        WebElement curr;
        WebElement prev;
        for(int j = 0;j<30;j++){
            for(int i =2;i<=9;i++){
                curr = wd.findElement(By.xpath("//*[@id=\"root\"]/div/div[1]/div[2]/div/div["+i+"]/dl/dd[2]"));
                prev = wd.findElement(By.xpath("//*[@id=\"root\"]/div/div[1]/div[2]/div/div["+(i-1)+"]/dl/dd[2]"));
                String s1 = curr.getText().toLowerCase();
                String s2 = prev.getText().toLowerCase();
                assertTrue(s1.compareTo(s2)>=0);
            }
            we.click();
        }

    }

    @Test
    public void testSortedArtistName() throws InterruptedException {
        wd.get("https://je66yliu.github.io/songtrackr/#/artists/page/1");
        Thread.sleep(1000);
        WebElement we = wd.findElement(By.xpath("//*[@id=\"sort-dropdown\"]"));
        we.click();
        Thread.sleep(200);

        we = wd.findElement(By.xpath("//*[@id=\"root\"]/div/div[1]/div/div[1]/div[2]/div/div/button[1]"));
        we.click();
        Thread.sleep(200);

        we = wd.findElement(By.xpath("//*[@id=\"root\"]/div/div[1]/div/nav[1]/ul/li[9]/button"));
        WebElement curr;
        WebElement prev;
        for(int j = 0;j<30;j++){
            for(int i =2;i<=9;i++){
                curr = wd.findElement(By.xpath("//*[@id=\"root\"]/div/div[1]/div/div[2]/div["+(i)+"]/dl/dd[1]"));
                prev = wd.findElement(By.xpath("//*[@id=\"root\"]/div/div[1]/div/div[2]/div["+(i-1)+"]/dl/dd[1]"));
                String s1 = curr.getText().toLowerCase();
                String s2 = prev.getText().toLowerCase();
                assertTrue(s1.compareTo(s2)>=0);
            }
            we.click();
        }

    }
}
