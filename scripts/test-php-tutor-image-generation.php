<?php
declare(strict_types=1);
require __DIR__ . '/../php/api/tutor-image-generation.php';

function testImage(bool $condition, string $message): void {
    if (!$condition) {
        fwrite(STDERR, "FAILED: ".$message."\n");
        exit(1);
    }
}
$config=['tutor_image_generation'=>['enabled'=>false,'api_key'=>'fake','model'=>'gemini-2.5-flash-image']];
testImage(!tutorImageGenerationEnabled($config),'default disabled');
testImage(!tutorImageGenerationEnabled([]),'no key');
testImage(!tutorImageGenerationEnabled(['tutor_image_generation'=>[
    'enabled'=>true,'api_key'=>'fake','model'=>'unknown-image-model'
]]),'model whitelist');
$unavailable=generateTutorImage($config, 'Tudsz képet mutatni?', 'C-dúr');
testImage($unavailable['mode']==='image-unavailable','closed without billing');
$prompt=tutorImagePrompt('Készíts egy dúr akkord ábrát', 'Mi a dúr akkord?');
testImage(str_contains($prompt,'dúr akkord') && str_contains($prompt,'music-theory'),'request context');
fwrite(STDOUT,"Image generation config and disabled-mode tests passed\n");
