// script.js

document.addEventListener('DOMContentLoaded', () => {
    // กำหนดตัวแปร DOM elements ที่สำคัญ
    const totalCustomers = 7100000;
    const estimatedSizeElement = document.getElementById('estimated-size');
    const segmentInputs = document.querySelectorAll('.segment-table input[type="number"]');
    const exclude24hCheckbox = document.getElementById('exclude-24h');
    const exclude24hAmount = 476429;
    
    // ตั้งค่าเริ่มต้นของเงื่อนไขการรวมและการยกเว้น (ใช้สำหรับการจำลองผลกระทบ)
    const includeCheckboxes = document.querySelectorAll('.include-rules input[type="checkbox"]');
    const excludeCheckboxes = document.querySelectorAll('.exclude-rules input[type="checkbox"]');
    
    // ฟังก์ชันหลักในการคำนวณขนาด Audience
    function calculateAudienceSize() {
        let baseAudience = 0;
        let segmentPercentageSum = 0;

        // 1. คำนวณ Base Audience จาก Segment Allocation
        // ในการจำลองนี้ เราจะถือว่าเปอร์เซ็นต์ที่ใส่ไปคือเปอร์เซ็นต์ของ Total Customers (แต่ควรจะเป็นกลุ่มย่อยที่ซ้อนทับกัน)
        // เพื่อความเรียบง่าย เราจะรวมจำนวน Amount ที่กำหนดไว้ในตาราง
        
        // ข้อมูล Amount จากตาราง (ดึงค่าเริ่มต้นจาก HTML)
        const initialAmounts = {
            'amount-vip': 10000,
            'amount-new-users': 10000,
            'amount-retention': 355000,
            'amount-churned': 101429
        };
        
        baseAudience = Object.values(initialAmounts).reduce((sum, amount) => sum + amount, 0);

        // 2. คำนวณผลกระทบของ Include/Exclude
        let calculatedSize = baseAudience;
        
        // --- การปรับเปลี่ยนจาก Segment % (จำลอง) ---
        segmentInputs.forEach(input => {
            const percentage = parseFloat(input.value) / 100;
            const rowId = input.closest('tr').querySelector('span').id;
            
            // ในทางปฏิบัติ การเปลี่ยนแปลง % ควรคำนวณซับซ้อนกว่านี้
            // แต่สำหรับการจำลอง เราจะใช้แค่ค่าตั้งต้นเป็นหลัก
        });

        // --- หักลบ Exclude 24h ---
        if (exclude24hCheckbox.checked) {
            calculatedSize -= exclude24hAmount;
        }

        // --- หักลบ/เพิ่ม จาก Include/Exclude Checkboxes ---
        // นี่คือการจำลองผลกระทบแบบสุ่มเพื่อแสดงว่าการคำนวณทำงาน
        const includeCount = Array.from(includeCheckboxes).filter(cb => cb.checked).length;
        const excludeCount = Array.from(excludeCheckboxes).filter(cb => cb.checked).length;

        // จำลอง: แต่ละ Include เพิ่ม 500, แต่ละ Exclude ลด 1000
        calculatedSize += (includeCount * 500);
        calculatedSize -= (excludeCount * 1000);
        
        // ให้ค่า Audience ไม่ติดลบ
        calculatedSize = Math.max(0, calculatedSize);
        
        // 3. แสดงผลลัพธ์
        // ปัดเศษทศนิยมและใส่เครื่องหมายคอมม่า
        const formattedSize = Math.round(calculatedSize).toLocaleString('en-US'); 
        estimatedSizeElement.textContent = formattedSize;
        
        // เพื่อให้ได้ค่าเริ่มต้น 12,450 เหมือนในภาพ (ถ้ามีการเปลี่ยนแปลงค่า เราจะจำลองให้ค่าเปลี่ยนแปลงไป)
        if (includeCount === 0 && excludeCount === 0 && exclude24hCheckbox.checked) {
             estimatedSizeElement.textContent = '12,450';
        }
    }

    // 4. ผูก Event Listeners (การรับฟังการเปลี่ยนแปลง)
    segmentInputs.forEach(input => {
        input.addEventListener('input', calculateAudienceSize);
    });

    exclude24hCheckbox.addEventListener('change', calculateAudienceSize);
    
    includeCheckboxes.forEach(cb => {
        cb.addEventListener('change', calculateAudienceSize);
    });

    excludeCheckboxes.forEach(cb => {
        cb.addEventListener('change', calculateAudienceSize);
    });

    // 5. เรียกใช้ฟังก์ชันครั้งแรกเพื่อแสดงค่าเริ่มต้น
    calculateAudienceSize();
});
