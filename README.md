# PHP to UML Generator

A powerful tool that automatically generates UML class diagrams from PHP source code. This tool helps developers visualize their PHP codebase structure through interactive UML diagrams.

## 🌟 Features

- **Easy File Upload**: Simple interface to upload PHP files
- **Interactive UML Diagrams**: Pan, zoom, and interact with generated diagrams
- **Export Capability**: Download generated UML diagrams as PNG images
- **Multiple File Support**: Upload and analyze multiple PHP files simultaneously
- **Real-time Generation**: Instant UML diagram generation
- **Interactive Canvas**: Easy navigation and manipulation of the generated diagram

## 🚀 Quick Start

### Prerequisites

- PHP 5.0 or higher
- Web server (Apache/Nginx)
- Modern web browser

### Installation

#### Using Docker (Recommended)
```bash
# Clone the repository
git clone https://github.com/AzarguNazari/PHP-To-UML.git

# Navigate to project directory
cd PHP-To-UML

# Start the containers
docker-compose up -d

# Access the application at
http://localhost
```

#### Manual Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/AzarguNazari/PHP-To-UML.git
   ```
2. Copy the files to your web server directory:
   ```bash
   cp -r PHP-To-UML/* /var/www/html/
   ```
3. Access through your web browser at `http://localhost`

## 📖 How to Use

1. **Access the Tool**
   - Open your web browser and navigate to the application URL

2. **Upload PHP Files**
   - Click on the upload button
   - Select one or multiple PHP files containing your classes
   - Click "Upload" to generate the UML diagram

3. **Interact with the Diagram**
   - Use mouse wheel to zoom in/out
   - Click and drag to pan around the diagram
   - Click the download button to save the diagram as PNG

## 🎯 Example Usage

The repository includes example PHP files that you can use to test the tool:
- [Example 1](https://github.com/AzarguNazari/PHP-To-UML/tree/master/src/Tests/test1)
- [Example 2](https://github.com/AzarguNazari/PHP-To-UML/tree/master/src/Tests/test2)

### Process Flow

1. **Upload Page**
   ![The uploading files page](https://github.com/AzarguNazari/PHPtoUML/blob/master/snapshot/input%20option.png)

2. **Generation Process**
   ![Generating](https://github.com/AzarguNazari/PHPtoUML/blob/master/snapshot/geneating.png)

3. **Final Result**
   ![Generated UML Diagram](https://github.com/AzarguNazari/PHPtoUML/blob/master/snapshot/generatedUML.png)

## 🛠️ Technical Details

- Built with PHP 5.0
- Uses HTML5 Canvas for diagram rendering
- Implements object-oriented design principles
- Supports standard UML class diagram notation

## 🤝 Contributing

Contributions are welcome! Feel free to:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🔍 Support

If you encounter any issues or have questions, please [open an issue](https://github.com/AzarguNazari/PHP-To-UML/issues) on GitHub.
