package resume_manager.cripple.com.resumemanager;

import android.Manifest;
import android.app.Activity;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;

import com.flurgle.camerakit.CameraView;
import com.karan.churi.PermissionManager.PermissionManager;

import java.util.ArrayList;
import java.util.List;

public class CameraActivity extends AppCompatActivity {

    private PermissionManager permission;
    private CameraView cameraView;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_camera);

        cameraView = (CameraView)  findViewById(R.id.camera);


        permission=new PermissionManager() {
            @Override
            public void ifCancelledAndCanRequest(Activity activity) {
                // Do Customized operation if permission is cancelled without checking "Don't ask again"
                // Use super.ifCancelledAndCanRequest(activity); or Don't override this method if not in use
            }

            @Override
            public void ifCancelledAndCannotRequest(Activity activity) {
                // Do Customized operation if permission is cancelled with checking "Don't ask again"
                // Use super.ifCancelledAndCannotRequest(activity); or Don't override this method if not in use
            }

            @Override
            public List<String> setPermission() {
                // If You Don't want to check permission automatically and check your own custom permission
                // Use super.setPermission(); or Don't override this method if not in use
                List<String> customPermission=new ArrayList<>();
                customPermission.add(Manifest.permission.CAMERA);
                return customPermission;
            }
        };
        permission.checkAndRequestPermissions(this);
    }

    @Override
    public void onRequestPermissionsResult(int requestCode,String permissions[], int[] grantResults) {
        permission.checkResult(requestCode,permissions, grantResults);
        ArrayList<String> granted = permission.getStatus().get(0).granted;

        if (granted.contains(Manifest.permission.CAMERA)) {
            cameraView.start();
        } else {
            Log.d("Permission-Camera", "Camera Permission Denied");
        }
    }

    @Override
    protected void onResume() {
        if (permission.getStatus().get(0).granted.contains(Manifest.permission.CAMERA)) {
            cameraView.start();
        }
        super.onResume();
    }

    @Override
    protected void onPause() {
        super.onPause();
        cameraView.stop();
    }
}
