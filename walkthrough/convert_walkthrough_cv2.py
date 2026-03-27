import os
import cv2
import numpy as np
from PIL import Image, ImageSequence
import subprocess

# Paths from session
dir_path = r"C:\Users\kunal\.gemini\antigravity\brain\76656cd0-53f8-4c73-a54c-5306903d1f8d"
part1 = os.path.join(dir_path, "tambola_walkthrough_detailed_1160_1774620092942.webp")
part2 = os.path.join(dir_path, "tambola_walkthrough_part2_final_1173_1774620497364.webp")
out_dir = r"d:\tambola-tracker\walkthrough"
out1 = os.path.join(out_dir, "part1.mp4")
out2 = os.path.join(out_dir, "part2.mp4")
final_out = os.path.join(out_dir, "Tambola_Tracker_Walkthrough.mp4")

def convert_webp_to_mp4(webp_path, out_mp4):
    """Memory-efficient frame extraction using OpenCV."""
    if not os.path.exists(webp_path):
        print(f"File not found: {webp_path}")
        return False
        
    print(f"\n--- Transcoding: {os.path.basename(webp_path)} ---")
    img = Image.open(webp_path)
    
    # Define codec and create VideoWriter
    # 'mp4v' is widely supported on Windows.
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    w, h = img.size
    
    # We'll use 25 fps as targeted for the recordings
    writer = cv2.VideoWriter(out_mp4, fourcc, 25.0, (w, h))
    
    if not writer.isOpened():
        print("Error: Could not open VideoWriter.")
        return False

    count = 0
    for frame in ImageSequence.Iterator(img):
        # Convert PIL to BGR for OpenCV
        frame_rgb = frame.convert("RGB")
        frame_bgr = cv2.cvtColor(np.array(frame_rgb), cv2.COLOR_RGB2BGR)
        writer.write(frame_bgr)
        count += 1
        if count % 100 == 0:
            print(f"  Processed {count} frames...")
            
    writer.release()
    print(f"SUCCESS: Created {out_mp4} with {count} frames.")
    return True

def main():
    if not os.path.exists(out_dir):
        os.makedirs(out_dir)
        
    # Step 1: Convert both to MP4
    if convert_webp_to_mp4(part1, out1) and convert_webp_to_mp4(part2, out2):
        print("\n--- Finalizing Walkthrough Video ---")
        
        # Step 2: Create concat list
        list_path = os.path.join(out_dir, "list.txt")
        # Use relative filenames in the list to avoid escaping headaches
        with open(list_path, 'w') as f:
            f.write(f"file 'part1.mp4'\nfile 'part2.mp4'\n")
            
        # Step 3: Use ffmpeg to concat and re-encode to stable H.264
        # We re-encode to ensure the 'mp4v' (ISO MPEG-4) is converted to 'avc1' (H.264)
        cmd = [
            'ffmpeg', '-y', 
            '-f', 'concat', 
            '-safe', '0', 
            '-i', 'list.txt', 
            '-c:v', 'libx264', 
            '-pix_fmt', 'yuv420p',
            '-preset', 'medium', 
            '-crf', '22',
            'Tambola_Tracker_Walkthrough.mp4'
        ]
        
        print("Running FFmpeg concat...")
        result = subprocess.run(cmd, cwd=out_dir, capture_output=True, text=True)
        
        if result.returncode == 0:
            print("\n✨ ALL DONE!")
            print(f"Final Video: {final_out}")
            # Clean up intermediates
            # os.remove(out1)
            # os.remove(out2)
            # os.remove(list_path)
        else:
            print("\n❌ FFmpeg concat failed:")
            print(result.stderr)

if __name__ == "__main__":
    main()
