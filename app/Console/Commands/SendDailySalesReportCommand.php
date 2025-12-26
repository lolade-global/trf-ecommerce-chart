<?php

namespace App\Console\Commands;

use App\Jobs\SendDailySalesReport;
use Illuminate\Console\Command;

class SendDailySalesReportCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sales:report';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send daily sales report to admin(s)';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Generating daily sales report...');

        SendDailySalesReport::dispatch();

        $this->info('Daily sales report has been queued for sending.');

        return Command::SUCCESS;
    }
}
