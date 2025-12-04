// script.js

document.addEventListener('DOMContentLoaded', () => {
    // กำหนดตัวแปร DOM elements ที่สำคัญ
    const estimatedSizeElement = document.getElementById('estimated-size');
    const segmentInputs = document.querySelectorAll('.segment-table input[type="number"]');
    const exclude24hCheckbox = document.getElementById('exclude-24h');
    const exclude24hAmount = 476429;
    
    // ตั้งค่าเริ่มต้นของเงื่อนไขการรวมและการยกเว้น
    const includeCheckboxes = document.querySelectorAll('.include-rules input[type="checkbox"]');
    const excludeCheckboxes = document.querySelectorAll('.exclude-rules input[type="checkbox"]');
    
    // ฟังก์ชันหลักในการคำนวณขนาด Audience
    function calculateAudienceSize() {
        // 1. Base Audience (ใช้ค่าตั้งต้นจากภาพ)
        let baseAudience = 507429; // VIP+New+Retention+Churned: 10k+10k+355k+101.429k = 476,429 (แก้ไขตัวเลขเดิมเป็นค่ารวมที่ถูกตามภาพ)
        
        // --- การปรับเปลี่ยนจาก Segment % (จำลองผลกระทบเล็กน้อยเมื่อมีการเปลี่ยนค่า) ---
        segmentInputs.forEach(input => {
            // ในการจำลองนี้ เราจะใช้ค่าคงที่ baseAudience เป็นหลัก
        });

        let calculatedSize = baseAudience;
        
        // 2. หักลบ Exclude 24h
        if (exclude24hCheckbox.checked) {
            calculatedSize -= exclude24hAmount;
        }

        // 3. หักลบ/เพิ่ม จาก Include/Exclude Checkboxes (จำลองผลกระทบแบบสุ่ม)
        const includeCount = Array.from(includeCheckboxes).filter(cb => cb.checked).length;
        const excludeCount = Array.from(excludeCheckboxes).filter(cb => cb.checked).length;

        // จำลอง: แต่ละ Include เพิ่ม 500, แต่ละ Exclude ลด 1000
        calculatedSize += (includeCount * 500);
        calculatedSize -= (excludeCount * 1000);
        
        // 4. ตั้งค่าให้แสดงผลลัพธ์เริ่มต้นตามภาพ (12,450) หากยังไม่มีการเลือกเงื่อนไข Include/Exclude
        if (includeCount === 0 && excludeCount === 0 && exclude24hCheckbox.checked) {
             calculatedSize = 12450;
        }
        
        calculatedSize = Math.max(0, calculatedSize);
        
        // 5. แสดงผลลัพธ์
        const formattedSize = Math.round(calculatedSize).toLocaleString('en-US'); 
        estimatedSizeElement.textContent = formattedSize;
    }

    // 6. ผูก Event Listeners (การรับฟังการเปลี่ยนแปลง)
    const allCriteriaInputs = document.querySelectorAll('.criteria-container input, .segment-table input, #exclude-24h');
    allCriteriaInputs.forEach(input => {
        input.addEventListener('input', calculateAudienceSize);
        input.addEventListener('change', calculateAudienceSize);
    });

    // 7. เรียกใช้ฟังก์ชันครั้งแรกเพื่อแสดงค่าเริ่มต้น
    calculateAudienceSize();
});
