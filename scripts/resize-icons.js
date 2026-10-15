const sharp = require('sharp');
const path = require('path');

const SOURCE = path.join(__dirname, '..', 'img', 'icon', '800.png');
const OUTPUT_DIR = path.join(__dirname, '..', 'img', 'icon');

// Todos os tamanhos que devem existir como arquivos numerados
// 800 é o arquivo fonte — incluído na lista para documentação, mas o script pula (já existe)
const SIZES = [16, 19, 32, 48, 128, 512, 1024];

async function main() {
    console.log('🖼  Redimensionando 800.png para todos os tamanhos...\n');

    for (const size of SIZES) {
        const outFile = path.join(OUTPUT_DIR, `${size}.png`);
        await sharp(SOURCE)
            .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
            .png({ compressionLevel: 9 })
            .toFile(outFile);
        console.log(`  ✅  ${size}x${size}  →  ${size}.png`);
    }

    console.log('\n✨ Todos os ícones gerados com sucesso!');
}

main().catch(err => {
    console.error('❌ Erro:', err.message);
    process.exit(1);
});
