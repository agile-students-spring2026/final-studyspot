# StudySpot: UX Design

## Prototype
**Figma Prototype:** https://www.figma.com/proto/tJ5e8MQPpcdZxXcQ8R1nx4/StudySpot?node-id=0-1&t=QkFcxlqE85c668rE-1

---

## App Map
![StudySpot App Map](<./ux-design/StudySpot App Map (1).png>)

Purpose: High-level hierarchy of the StudySpot MVP screens and key overlays.

---

## Wireframes

### 1) Login
![Login](<./ux-design/Login (1).png>)

Purpose: Student logs in using their university email + password.  
Key actions: “Log In” continues into the app; “Sign Up” goes to registration.

### 2) Sign Up
![Sign Up](<./ux-design/Sign Up (1).png>)

Purpose: Student begins registration with a university email.  
Key actions: “Verify” goes to email verification.

### 3) Verify Email
![Verify Email](<./ux-design/Verify Email (1).png>)

Purpose: User enters verification code sent to email.  
Key actions: “Verify” continues to set password.

### 4) Choose Password
![Choose Password](<./ux-design/Choose password (1).png>)

Purpose: User sets a password after email verification.  
Key actions: “Sign up” completes account creation and enters the main app.

---

### 5) Spot List (Browse)
![Spot List](<./ux-design/Spot List (1).png>)

Purpose: Browse study spots; search and open filters; view details of a spot.  
Key actions: “Filter” opens filter overlay; “View” opens Spot Details; “Save” saves a spot.

### 6) Filter Overlay
![Filter Overlay](<./ux-design/Filter Overlay (1).png>)

Purpose: Apply filters (noise, outlets, Wi-Fi, busyness) to narrow results.  
Key actions: “Apply” returns to Spot List with filters applied.

---

### 7) Spot Details
![Spot Details](<./ux-design/Spot Details (1).png>)

Purpose: View a spot’s details (location, hours, busyness, rating, description).  
Key actions: “Save” triggers saved confirmation; “[Update]” triggers busyness overlay; “Rate Spot” triggers rate/review overlay.

### 8) Spot Details: Saved Overlay
![Saved Overlay](<./ux-design/Spot Details_ Saved Overlay (1).png>)

Purpose: Confirms the spot was saved successfully.  
Key actions: “Done” returns to Spot Details.

### 9) Spot Details: Busyness Overlay
![Busyness Overlay](<./ux-design/Spot Details_ Busyness Overlay (1).png>)

Purpose: User updates current busyness (quiet/moderate/busy).  
Key actions: “Done” returns to Spot Details.

### 10) Spot Details: Review / Rate Overlay
![Review Overlay](<./ux-design/Review Overlay.png>)

Purpose: User submits a star rating and short review.  
Key actions: “Post” returns to Spot Details.

---

### 11) Add Spot
![Add Spot](<./ux-design/Add Spot (1).png>)

Purpose: User submits a new study spot (name, address, hours, description, image).  
Key actions: “Submit” attempts submission.

### 12) Add Spot: Success
![Add Spot Success](<./ux-design/Add Spot - Success (1).png>)

Purpose: Confirms the new spot was added.  
Key actions: “Done” returns to Add Spot or navigates back to browsing (prototype decision).

### 13) Add Spot: Error
![Add Spot Error](<./ux-design/Add Spot - Error (1).png>)

Purpose: Handles submission failure.  
Key actions: “Try Again” returns to Add Spot form.

---

### 14) Saved Spots List
![Saved Spots List](<./ux-design/Saved Spots List (1).png>)

Purpose: Shows spots the user saved.  
Key actions: “Remove from Saved Spots” triggers remove confirmation overlay.

### 15) Remove Saved Spot (Confirm)
![Remove Saved Spot](<./ux-design/Remove Saved Spot.png>)

Purpose: Confirms user wants to remove a saved spot.  
Key actions: “Remove” proceeds to success confirmation.

### 16) Remove Saved Spot: Success
![Remove Saved Spot Success](<./ux-design/Remove Saved Spot Success.png>)

Purpose: Confirms the saved spot was removed.  
Key actions: “Done” returns to Saved Spots List.

---

### 17) Settings / Profile
![Settings](<./ux-design/Settings.png>)

Purpose: User profile hub (profile info + navigation to account-related pages).  
Key actions: “Log Out” exits to login (prototype decision).
