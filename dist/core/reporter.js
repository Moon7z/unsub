export class Reporter {
    results = [];
    startTime = 0;
    start() {
        this.startTime = Date.now();
        this.results = [];
    }
    addResult(result) {
        this.results.push(result);
    }
    generateReport() {
        const duration = (Date.now() - this.startTime) / 1000;
        const succeeded = this.results.filter(r => r.status === 'success').length;
        const failed = this.results.filter(r => r.status === 'failed').length;
        return {
            summary: {
                total: this.results.length,
                succeeded,
                failed,
                duration,
            },
            pages: this.results,
        };
    }
    async saveToFile(filePath) {
        const report = this.generateReport();
        const fs = await import('fs/promises');
        await fs.writeFile(filePath, JSON.stringify(report, null, 2), 'utf-8');
    }
}
//# sourceMappingURL=reporter.js.map