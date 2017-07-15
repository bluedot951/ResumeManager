package resume_manager.cripple.com.resumemanager;

import android.Manifest;
import android.app.Activity;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.provider.MediaStore;
import android.support.annotation.NonNull;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;

import com.flurgle.camerakit.CameraListener;
import com.flurgle.camerakit.CameraView;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.firebase.storage.UploadTask;
import com.karan.churi.PermissionManager.PermissionManager;

import java.io.ByteArrayOutputStream;
import java.util.ArrayList;
import java.util.List;
import com.google.firebase.storage.FirebaseStorage;
import com.google.firebase.storage.StorageReference;

import at.markushi.ui.CircleButton;

public class CameraActivity extends AppCompatActivity {

    private PermissionManager permission;
    private CameraView mCameraView;
    private StorageReference mStorageRef;
    private CircleButton mCircleButton;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_camera);

        mCameraView = (CameraView) findViewById(R.id.camera);
        mCircleButton = (CircleButton) findViewById(R.id.image);

        mStorageRef = FirebaseStorage.getInstance().getReference();

        mCameraView.setCameraListener(new CameraListener() {
            @Override
            public void onPictureTaken(byte[] jpeg) {
                super.onPictureTaken(jpeg);
                Bitmap image = BitmapFactory.decodeByteArray(jpeg, 0, jpeg.length);
                uploadToServer(image);
            }
        });

        mCircleButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                mCameraView.captureImage();
            }
        });

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
                customPermission.add(Manifest.permission.WRITE_EXTERNAL_STORAGE);
                customPermission.add(Manifest.permission.INTERNET);
                customPermission.add(Manifest.permission.READ_EXTERNAL_STORAGE);
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
            mCameraView.start();
        } else {
            Log.d("Permission-Camera", "Camera Permission Denied");
        }
    }

    @Override
    protected void onResume() {
        if (permission.getStatus().get(0).granted.contains(Manifest.permission.CAMERA)) {
            mCameraView.start();
        }
        super.onResume();
    }

    @Override
    protected void onPause() {
        super.onPause();
        mCameraView.stop();
    }

    private void uploadToServer(Bitmap image) {
//        Uri imageUri = Uri.fromFile(new File("rahul's_path"));
        // Store image as hash
        StorageReference resumesRef = mStorageRef.child(image.hashCode() + ".jpeg");

        ByteArrayOutputStream bytes = new ByteArrayOutputStream();
        image.compress(Bitmap.CompressFormat.JPEG, 100, bytes);

        resumesRef.putBytes(bytes.toByteArray());
    }
}
