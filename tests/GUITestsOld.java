import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.Dimension;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import static org.junit.jupiter.api.Assertions.*;


public class GUITestsOld {
    static WebDriver wd;


    @BeforeEach
    public void setup() throws InterruptedException {
        //download chromedriver from https://chromedriver.chromium.org/downloads
        //replace 2nd arg with path to your chromedriver
        System.setProperty("webdriver.chrome.driver", "C:\\Users\\Ry\\Desktop\\School\\EE461L\\chromedriver.exe");
        wd = new ChromeDriver();
        Thread.sleep(200);
        wd.get("https://je66yliu.github.io/songtrackr/#/songs");
        Thread.sleep(2000);
    }


    @Test
    public void testURL() throws InterruptedException {
        WebElement we = wd.findElement(By.xpath("//*[text()='The Box']"));
        we.click();
        Thread.sleep(500);
        assertEquals("https://je66yliu.github.io/songtrackr/#/track/the-box-by-roddy-ricch",wd.getCurrentUrl());

        wd.manage().window().setSize(new Dimension(1440, 1024));
        Thread.sleep(500);
        we = wd.findElement(By.xpath("//*[@id=\"basic-navbar-nav\"]/div/div[2]/a"));
        we.click();
        we = wd.findElement(By.xpath("//*[@id=\"basic-navbar-nav\"]/div/div[2]/div/a[1]"));
        we.click();
        assertEquals("https://je66yliu.github.io/songtrackr/#/songs", wd.getCurrentUrl());
        Thread.sleep(500);

        we = wd.findElement(By.xpath("//*[@id=\"basic-navbar-nav\"]/div/div[2]/a"));
        we.click();
        we = wd.findElement(By.xpath("//*[@id=\"basic-navbar-nav\"]/div/div[2]/div/a[2]"));
        we.click();
        assertEquals("https://je66yliu.github.io/songtrackr/#/artists", wd.getCurrentUrl());
        Thread.sleep(500);

        we = wd.findElement(By.xpath("//*[@id=\"basic-navbar-nav\"]/div/div[2]/a"));
        we.click();
        we = wd.findElement(By.xpath("//*[@id=\"basic-navbar-nav\"]/div/div[2]/div/a[3]"));
        we.click();
        assertEquals("https://je66yliu.github.io/songtrackr/#/charts", wd.getCurrentUrl());
        Thread.sleep(500);

        wd.quit();
    }

    @Test
    public void testSmallWindowURL() throws InterruptedException {
        WebElement we;


        we = wd.findElement(By.xpath("//*[@id=\"root\"]/div/nav/div/div[2]/button"));
        we.click();
        Thread.sleep(500);
        we = wd.findElement(By.xpath("//*[@id=\"basic-navbar-nav\"]/div/div[2]/a"));
        we.click();
        we = wd.findElement(By.xpath("//*[@id=\"basic-navbar-nav\"]/div/div[2]/div/a[2]"));
        we.click();
        assertEquals("https://je66yliu.github.io/songtrackr/#/artists", wd.getCurrentUrl());
        Thread.sleep(500);


        we = wd.findElement(By.xpath("//*[@id=\"basic-navbar-nav\"]/div/div[2]/a"));
        we.click();
        we = wd.findElement(By.xpath("//*[@id=\"basic-navbar-nav\"]/div/div[2]/div/a[3]"));
        we.click();
        assertEquals("https://je66yliu.github.io/songtrackr/#/charts", wd.getCurrentUrl());
        Thread.sleep(500);

        we = wd.findElement(By.xpath("//*[@id=\"basic-navbar-nav\"]/div/div[2]/a"));
        we.click();
        we = wd.findElement(By.xpath("//*[@id=\"basic-navbar-nav\"]/div/div[2]/div/a[1]"));
        we.click();
        assertEquals("https://je66yliu.github.io/songtrackr/#/songs", wd.getCurrentUrl());
        Thread.sleep(500);


        wd.quit();
    }

    @Test
    public void testNext() throws InterruptedException {
        WebElement we = wd.findElement(By.xpath("//*[@id=\"root\"]/div/div/div[3]/div/div[2]/div/div[3]/button[2]"));
        we.click();
        we = wd.findElement(By.xpath("//*[@id=\"root\"]/div/div/div[3]/div/div[1]/table/tbody/tr[1]/td[4]"));
        assertEquals("4",we.getText());
        Thread.sleep(500);
        wd.quit();
    }

    @Test
    public void testSorted() throws InterruptedException {
        WebElement we = wd.findElement(By.xpath("//*[@id=\"root\"]/div/div/div[3]/div/div[1]/table/thead/tr/th[5]/span/span[1]"));
        Thread.sleep(1000);
        //we.click();
        we = wd.findElement(By.xpath("//*[@id=\"root\"]/div/div/div[3]/div/div[2]/div/div[3]/button[2]"));
        WebElement rank;
        int expected = 1;
        for(int j = 0;j<25;j++){
            for(int i =1;i<11;i++){
                rank = wd.findElement(By.xpath("//*[@id=\"root\"]/div/div/div[3]/div/div[1]/table/tbody/tr["+ i + "]/td[4]"));
                int actual = Integer.parseInt(rank.getText());
                if(actual > expected +1)
                    fail("expected: " + expected + " or " + (expected+1) + ", actual: " + actual);
                expected = actual;
                Thread.sleep(10);
            }
            if(j!=24)
                we.click();
        }
        wd.quit();
    }

    @Test
    public void testSortedName() throws InterruptedException {
        WebElement we = wd.findElement(By.xpath("//*[@id=\"root\"]/div/div/div[3]/div/div[1]/table/thead/tr/th[2]/span"));
        Thread.sleep(1000);
        we.click();
        we = wd.findElement(By.xpath("//*[@id=\"root\"]/div/div/div[3]/div/div[2]/div/div[3]/button[2]"));
        WebElement rank;
        String prev = "";
        for(int j = 0;j<25;j++){
            for(int i =1;i<11;i++){
                rank = wd.findElement(By.xpath("//*[@id=\"root\"]/div/div/div[3]/div/div[1]/table/tbody/tr["+i+"]/th/span"));
                String s = rank.getText().toLowerCase();
                if(prev.compareTo(s) > 0)
                    fail(prev + " doesn't come before " + s);
                prev = s;
                Thread.sleep(10);
            }
            if(j!=24)
                we.click();
        }
        wd.quit();
    }

}
