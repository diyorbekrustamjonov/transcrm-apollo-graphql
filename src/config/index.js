import dotenv from 'dotenv';
import { join } from 'path';

!async function(){
    dotenv.config({
        path: join(process.cwd(), '.env')
    })
}();
