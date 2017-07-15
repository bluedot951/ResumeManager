package resume_manager.cripple.com.resumemanager;

import com.google.firebase.database.IgnoreExtraProperties;

/**
 * Created by sjinesh on 7/15/17.
 */

@IgnoreExtraProperties
public class User {
    public String username;
    public String email;
    public int leftSwipe;
    public int rightSwipe;
    public long unixTime;
    public String imageName;

    public User() {
    }

    public User(String username, String email, long unixTime, String imageName) {
        this.username = username;
        this.email = email;
        this.leftSwipe = 0;
        this.rightSwipe = 0;
        this.unixTime = unixTime;
        this.imageName = imageName;
    }
}
