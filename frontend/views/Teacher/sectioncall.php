<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SSIT 3B</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: Arial, sans-serif;
        }
        
        body {
            background-color: #f5f5f5;
            padding: 20px;
            color: #333;
        }
        
        .container {
            max-width: 800px;
            margin: 0 auto;
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        h1 {
            text-align: center;
            margin-bottom: 20px;
            color: #2c3e50;
        }
        
        h2 {
            margin: 25px 0 15px;
            color: #3498db;
            border-bottom: 1px solid #eee;
            padding-bottom: 8px;
        }
        
        .section-info {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 6px;
            margin-bottom: 20px;
        }
        
        .info-item {
            margin-bottom: 10px;
        }
        
        .info-label {
            font-weight: bold;
            display: inline-block;
            width: 80px;
        }
        
        hr {
            border: none;
            border-top: 1px dashed #ddd;
            margin: 20px 0;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        
        th, td {
            padding: 12px 15px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        
        th {
            background-color: #f2f2f2;
            font-weight: bold;
        }
        
        .status-present {
            color: #27ae60;
            font-weight: bold;
        }
        
        .status-absent {
            color: #e74c3c;
            font-weight: bold;
        }
        
        .action-icon {
            font-size: 18px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>SSIT 3B</h1>
        
        <h2>Section Information</h2>
        <div class="section-info">
            <div class="info-item">
                <span class="info-label">Subject</span>
                IT 101 - Introduction to Computing 1
            </div>
            <div class="info-item">
                <span class="info-label">Teacher</span>
                Boss Olen
            </div>
            <div class="info-item">
                <span class="info-label">Schedule</span>
                MWF 10:30 - 11:30
            </div>
        </div>
        
        <hr>
        
        <h2>Student List</h2>
        <table>
            <thead>
                <tr>
                    <th>Action</th>
                    <th>Student ID No.</th>
                    <th>Student Name</th>
                    <th>Section</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="action-icon">💬</td>
                    <td>23101000</td>
                    <td>William Sy</td>
                    <td>3B</td>
                    <td class="status-present">Present</td>
                </tr>
                <tr>
                    <td class="action-icon">💬</td>
                    <td>23101001</td>
                    <td>Cristalyn De Dios</td>
                    <td>3B</td>
                    <td class="status-absent">Absent</td>
                </tr>
                <tr>
                    <td class="action-icon">💬</td>
                    <td>23101002</td>
                    <td>Amihan Devas</td>
                    <td>3B</td>
                    <td class="status-present">Present</td>
                </tr>
                <tr>
                    <td class="action-icon">💬</td>
                    <td>23101003</td>
                    <td>Armen Lireo</td>
                    <td>3B</td>
                    <td class="status-present">Present</td>
                </tr>
                <tr>
                    <td class="action-icon">💬</td>
                    <td>23101004</td>
                    <td>Kruk Kruk</td>
                    <td>3B</td>
                    <td class="status-absent">Absent</td>
                </tr>
                <tr>
                    <td class="action-icon">💬</td>
                    <td>23101005</td>
                    <td>Ina Merz</td>
                    <td>3B</td>
                    <td class="status-present">Present</td>
                </tr>
                <tr>
                    <td class="action-icon">💬</td>
                    <td>23101006</td>
                    <td>William Sy</td>
                    <td>3B</td>
                    <td class="status-absent">Absent</td>
                </tr>
            </tbody>
        </table>
    </div>
</body>
</html>