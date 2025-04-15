import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    // Define o status HTTP (usa o status do HttpException ou 500 para erros genéricos)
    const status = exception instanceof HttpException 
      ? exception.getStatus() 
      : HttpStatus.INTERNAL_SERVER_ERROR;

    // Extrai a mensagem do erro
    const message =
      exception instanceof HttpException 
        ? (typeof exception.getResponse() === 'object'
            ? JSON.stringify(exception.getResponse())
            : exception.getResponse())
        : 'Internal server error';

    // Log do erro (você pode substituir por uma ferramenta de log, se desejar)
    console.error(`Erro ${status} em ${request.url}:`, exception);

    // Retorna a resposta formatada
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      error: message,
    });
  }
}
